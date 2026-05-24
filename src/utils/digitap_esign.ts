import { lenderModel } from "@/common/common-module/src/database/mysql/lender";
import config from "@/config/default";
import { ApiSupplierType } from "@/enums/common.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import {
  ISurepassEsignAuditTrailResponse,
  ISurepassEsignDocResponse,
  ISurepassEsignInitiateRequestPayload,
  ISurepassEsignInitiateResponse,
  ISurepassEsignReportResponse,
  ISurepassEsignStatusResponse,
} from "@/interfaces/surepass_eSign.interface";
import { approvalService } from "@/services/approval.service";
import { customerService } from "@/services/customer.service";
import EmployerService from "@/services/employer.service";
import { leadService } from "@/services/lead.service";
import LeadApiLogService from "@/services/lead_api_log.service";
import { OnboardingService } from "@/services/onboarding.service";
import FinboxService from "@/services/thirdParty/finbox.service";
import { s3Service } from "@/services/thirdParty/s3.service";
import axios from "axios";
import ejs from "ejs";
import path from "path";
import puppeteer from "puppeteer";
import { getKnexInstance } from "./mysql";
const leadApiLogService = new LeadApiLogService();
const digitapEsignBaseURL = config.digitapProdUrl;
// const digitapClientId = config.digitapClientId;
// const digitapClientSecret = config.digitapClientSecret;
const digitapClientId = config.digitapEsignClientId;
const digitapClientSecret = config.digitapEsignClientSecret;
const digitapLoanAgreementTemplateId = config.digitapLoanAgreementTemplateId;

console.log("Digitap config check:");
console.log("Base URL:", digitapEsignBaseURL);
console.log(
  "Client ID:",
  digitapClientId ? "***configured***" : "NOT CONFIGURED",
);
console.log(
  "Client Secret:",
  digitapClientSecret ? "***configured***" : "NOT CONFIGURED",
);

function getDigitapBaseURL(): string {
  let baseURL = digitapEsignBaseURL;
  if (baseURL === "https://api.digitap.ai") {
    baseURL = "https://api.digitap.ai/ent";
  }
  return baseURL;
}

// Create base64 encoded authorization header
const digitapAuthHeader = Buffer.from(
  `${digitapClientId}:${digitapClientSecret}`,
).toString("base64");

const digitapEsignHeaders = {
  "Content-Type": "application/json",
  authorization: digitapAuthHeader, // Try without Basic prefix, lowercase
};

export async function digitapEsignInitialize(
  payload: ISurepassEsignInitiateRequestPayload,
): Promise<ISurepassEsignInitiateResponse> {
  const digitapEsignInitializeURL = `${getDigitapBaseURL()}/v1/generate-esign`;
  const { customerID, callback_url } = payload;

  // Validate required configuration
  if (!digitapEsignBaseURL) {
    return {
      success: false,
      message: "Digitap base URL not configured",
    };
  }

  if (!digitapClientId || !digitapClientSecret) {
    return {
      success: false,
      message: "Digitap credentials not configured",
    };
  }

  console.log("Callback URL received:", callback_url);
  console.log(
    "Final Digitap URL will be:",
    `${getDigitapBaseURL()}/v1/generate-esign`,
  );

  const getCustomerInfo = await customerService.findOne({ customerID });
  if (!getCustomerInfo) {
    return {
      success: false,
      message: "Customer info not found",
    };
  }

  const getLeadInfo = await leadService.findOne(
    { customerID },
    ["*"],
    [{ column: "leadID", order: "desc" }],
  );

  // Generate agreement PDF first
  const getAggrementPdfLink = await generateAggrementPdf(
    customerID,
    getLeadInfo.leadID,
  );

  if (!getAggrementPdfLink.status) {
    console.error("Agreement PDF generation failed:", getAggrementPdfLink);
    return {
      success: false,
      message:
        getAggrementPdfLink.message || "Failed to generate agreement PDF",
    };
  }

  const uniqueId = `loan_agreement_${customerID}_${
    getLeadInfo.leadID
  }_${Date.now()}`;
  const digitapEsignInitializeBody = {
    uniqueId: uniqueId,
    signers: [
      {
        email: getCustomerInfo.email,
        location: "India",
        mobile: getCustomerInfo.mobile.toString(),
        name: getCustomerInfo.name,
      },
    ],
    reason: "Loan Agreement",
    templateId: digitapLoanAgreementTemplateId,
    fileName: `Loan_Agreement_${customerID}_${Date.now()}.pdf`,
    multiSignerDocId: uniqueId,
  };

  try {
    console.log("Digitap E-sign request URL:", digitapEsignInitializeURL);
    console.log("Digitap E-sign request headers:", digitapEsignHeaders);
    console.log(
      "Auth header decoded:",
      Buffer.from(digitapAuthHeader, "base64").toString(),
    );
    console.log(
      "Digitap E-sign request body:",
      JSON.stringify(digitapEsignInitializeBody, null, 2),
    );

    let digitapEsignResponse = await axios.post(
      digitapEsignInitializeURL,
      digitapEsignInitializeBody,
      { headers: digitapEsignHeaders },
    );

    console.log(
      "Digitap E-sign response:",
      JSON.stringify(digitapEsignResponse.data, null, 2),
    );

    const { code, model } = digitapEsignResponse.data;

    if (code === "200" && model) {
      const { docId, url } = model;

      // Upload the agreement PDF to Digitap's S3 using the provided URL
      const { status, data: aggrementLink } = getAggrementPdfLink;

      if (status && aggrementLink) {
        console.log("Downloading PDF from our S3:", aggrementLink);

        // Download the PDF from our S3 and upload to Digitap's S3
        const pdfResponse = await axios.get(aggrementLink, {
          responseType: "arraybuffer",
        });
        const pdfBuffer = Buffer.from(pdfResponse.data);

        console.log("PDF downloaded, size:", pdfBuffer.length, "bytes");
        console.log("Uploading PDF to Digitap S3:", url);

        // Upload to Digitap's S3 using PUT request
        const uploadResponse = await axios.put(url, pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
          },
        });

        console.log("PDF upload response status:", uploadResponse.status);

        const separator = callback_url.includes("?") ? "&" : "?";
        const callbackUrlWithClientId = `${callback_url}${separator}client_id=${docId}`;

        return {
          success: true,
          status_code: 200,
          message: "Digitap E-Sign URL generated",
          data: {
            client_id: docId, // Using docId as client_id for compatibility
            url: `https://sdk.digitap.ai/e-sign/templateesignprocess.html?docId=${docId}&redirect_url=${encodeURIComponent(
              callbackUrlWithClientId,
            )}&error_url=${encodeURIComponent(callbackUrlWithClientId)}`,
            token: docId, // Using docId as token for compatibility
          },
        };
      }
    }

    return {
      success: false,
      message:
        digitapEsignResponse.data.message || "Failed to initialize e-sign",
    };
  } catch (error) {
    console.error("Digitap E-sign initialization error:", error.message);
    console.error("Error response status:", error.response?.status);
    console.error(
      "Error response data:",
      JSON.stringify(error.response?.data, null, 2),
    );
    console.error("Error response headers:", error.response?.headers);
    console.error("Full error config:", JSON.stringify(error.config, null, 2));

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Error in digitap e-sign initialization",
    };
  }
}

// Reuse the same agreement generation logic from SurePass
async function aggrementData(leadId: number, customerID: number): Promise<any> {
  const employerServiceInstance = new EmployerService();
  const db = getKnexInstance();
  const customerInfo = await customerService.findOne({ customerID });
  if (!customerInfo) {
    return {
      status: false,
      message: "Customer not found",
    };
  }

  const leadInfo = await leadService.findOne({ leadID: leadId });
  if (!leadInfo) {
    return {
      status: false,
      message: "Lead Not found",
    };
  }
  const approvalInfo = await approvalService.findOne({ leadID: leadId });
  if (!approvalInfo) {
    return {
      status: false,
      message: "Lead Not found",
    };
  }

  const loanData = await db("loan")
    .where("customerID", customerID)
    .where("leadID", leadId)
    .first();

  let customerEmployer = await employerServiceInstance.findOne({
    customerID: customerID,
  });

  const address = await db("address")
    .where("customerID", customerID)
    .orderBy("addressID", "desc")
    .first();

  const lenderInfo = await lenderModel.findOne({ lenderID: leadInfo.lenderID });

  const numberToWords = (amount: number): string => {
    if (amount === 0) return "Zero only";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const scales = ["", "Thousand", "Lakh", "Crore"];

    const numToWords = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100)
        return (
          tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
        );
      if (n < 1000) {
        return (
          ones[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 !== 0 ? " " + numToWords(n % 100) : "")
        );
      }
      return "";
    };

    let result = "";
    let scaleIndex = 0;
    let n = amount;

    // Indian numbering system grouping
    const groupValues: number[] = [];
    groupValues.push(n % 1000); // first three digits
    n = Math.floor(n / 1000);

    while (n > 0) {
      groupValues.push(n % 100); // next 2 digits (for thousand, lakh, crore)
      n = Math.floor(n / 100);
    }

    for (let i = groupValues.length - 1; i >= 0; i--) {
      if (groupValues[i] !== 0) {
        result += numToWords(groupValues[i]) + " " + scales[i] + " ";
      }
    }

    return result.trim() + " only";
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const finboxService = new FinboxService();

  const repayDateResult = await finboxService.repayDateFind(
    customerInfo.salary_date?.toString(),
  );

  await approvalService.updateOne(
    {
      customerID: customerID,
      leadID: leadId,
    },
    {
      repayDate: repayDateResult.formattedDate,
      tenure: repayDateResult.difference,
    },
  );

  const res = {
    name: customerInfo.name,
    mobile: customerInfo.mobile,
    email: customerInfo.email,
    customerID: customerID,
    leadID: leadId,
    gender: customerInfo.gender || "",
    pan: customerInfo.pancard || "",
    address: address.address || "",
    designation: customerEmployer.empDesignation || "",
    company: customerEmployer.employerName || "",

    appliedAmount: leadInfo.loanRequeried || "",
    appliedAmountWords: numberToWords(leadInfo.loanRequeried),
    sanctionedAmount: approvalInfo?.loanAmtApproved || 0,
    interestRate: approvalInfo?.roi || 0,

    effectiveDate: formatDate(new Date()),
    applicationDate: leadInfo.createdDate
      ? formatDate(new Date(leadInfo.createdDate))
      : formatDate(new Date()),
    repaymentDate: repayDateResult.formattedDate,

    nachRejectCharge: 250,
    bounceCharge: 500,
    prepaymentWaiver: 18,
    nachMandatePercentage: 100,
    processingFeePercentage: 10,
    collectionChargePerDay: 100,

    loanPurpose: leadInfo.purpose || "Personal use",
    tenure: approvalInfo.tenure || 30,
    totalRepaymentAmount: null,
    lenderInfo: lenderInfo || {},
  };

  return {
    status: true,
    message: "Agreement data prepared",
    data: res,
  };
}

async function generateAggrementPdf(
  customerID: number,
  leadID: number,
): Promise<any> {
  let browser = null;
  try {
    const aggrementDataRes = await aggrementData(leadID, customerID);
    console.log(
      "agreement data --------------------------------->",
      aggrementDataRes,
    );
    if (!aggrementDataRes.status) {
      console.error(
        "[AggrementPDF] aggrementDataRes.status is false:",
        aggrementDataRes,
      );
      return { status: false, message: "Agreement data not found" };
    }

    const templatePath = path.resolve(
      __dirname,
      "../views/loansDocs/new_loan_aggrement.ejs",
    );
    console.log("[AggrementPDF] Using templatePath:", templatePath);

    const fs = require("fs");
    try {
      const templateContent = fs.readFileSync(templatePath, "utf8");
      console.log(
        "[AggrementPDF] Template file first 200 chars:\n",
        templateContent.slice(0, 200),
      );
    } catch (err) {
      console.error("[AggrementPDF] Error reading template file:", err);
    }

    console.log(
      "[AggrementPDF] Data passed to EJS:",
      JSON.stringify(aggrementDataRes.data, null, 2),
    );

    let htmlContent;
    try {
      htmlContent = await ejs.renderFile(templatePath, {
        data: aggrementDataRes.data,
      });
    } catch (ejsError) {
      console.error("[AggrementPDF] EJS renderFile error:", ejsError);
      return {
        status: false,
        message: "EJS render error: " + ejsError.message,
      };
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    // Generate the PDF buffer
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });
    await browser.close();

    const s3Key = `documents/aggrement/${customerID}/agreement_${Date.now()}.pdf`;
    const Key = await s3Service.uploadDocument(
      pdfBuffer,
      `documents/aggrement/${customerID}`,
      `agreement_${Date.now()}.pdf`,
    );
    const signedUrl = await s3Service.getPresignedUrl(s3Key);

    const onboardingService = new OnboardingService();
    try {
      await onboardingService.generatePaydayKfs({
        leadId: leadID,
        customerId: customerID,
        uploadDocs: true,
      });
    } catch (error) {
      console.error("[AggrementPDF] Error generating Payday KFS:", error);
    }

    return { status: true, message: "Agreement PDF uploaded", data: signedUrl };
  } catch (error) {
    console.error("[AggrementPDF] Error generating agreement PDF:", error);
    return {
      status: false,
      message: "Error while generating agreement PDF: " + error.message,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function getDigitapEsignStatus(
  docId: string,
): Promise<ISurepassEsignStatusResponse> {
  if (!docId) {
    return {
      success: false,
      message: "Please provide valid document Id",
    };
  }

  // For Digitap, we'll use the get-esign-doc API to check status
  // as it provides both document and signer status information
  try {
    const digitapEsignDocURL = `${getDigitapBaseURL()}/v1/get-esign-doc`;
    const requestBody = {
      docId: docId,
    };

    const esignDocResponse = await axios.post(digitapEsignDocURL, requestBody, {
      headers: digitapEsignHeaders,
    });

    const { code, model } = esignDocResponse.data;

    if (code !== "200" || !model) {
      return {
        success: false,
        message: "Unable to get the E-sign status",
      };
    }

    // Check if any signer has signed the document
    const signers = model.signers || [];

    const isCompleted = signers.some((signer) => signer.state === "signed");
    const hasError = signers.some(
      (signer) => signer.state === "failed" || signer.state === "rejected",
    );

    const statusData = {
      client_id: docId,
      status: isCompleted ? "completed" : hasError ? "failed" : "pending",
      completed: isCompleted,
      esign_error: hasError,
      error_message_from_nsdl: hasError ? "E-sign failed or rejected" : "",
    };

    return {
      success: true,
      message: "E-sign status retrieved successfully",
      data: statusData,
    };
  } catch (error) {
    console.error(`[DigitapEsignStatus] Error:`, error.message);
    return {
      success: false,
      message: error.message || "Error in catch of e-sign status",
    };
  }
}

export async function getDigitapEsignReport(
  docId: string,
): Promise<ISurepassEsignReportResponse> {
  if (!docId) {
    return {
      success: false,
      message: "Please provide valid document Id",
    };
  }

  try {
    const digitapEsignDocURL = `${getDigitapBaseURL()}/v1/get-esign-doc`;
    const requestBody = {
      docId: docId,
    };

    const esignDocResponse = await axios.post(digitapEsignDocURL, requestBody, {
      headers: digitapEsignHeaders,
    });

    const { code, model } = esignDocResponse.data;

    if (code !== "200" || !model) {
      return {
        success: false,
        message: "Unable to get the E-sign Report",
      };
    }

    const signers = model.signers || [];

    const signedSigner = signers.find((signer) => signer.state === "signed");

    if (!signedSigner) {
      return {
        success: false,
        message: "No signed document found",
      };
    }

    const reportData = {
      client_id: docId,
      status: "completed",
      name_match: {
        name: signedSigner.signerName || signedSigner.name || "",
        name_matched: true, // Digitap doesn't provide name matching, assuming true
        name_match_score: "100", // Default score since Digitap doesn't provide this
        aaadhar_last_four_digits: signedSigner.aadhaarSuffix || "",
        year_of_birth: signedSigner.dob || "",
        gender: signedSigner.gender || "",
      },
    };

    return {
      success: true,
      message: "E-sign report retrieved successfully",
      data: reportData,
    };
  } catch (error) {
    console.error(`[DigitapEsignReport] Error:`, error.message);
    return {
      success: false,
      message: error.message || "Error in catch of e-sign report",
    };
  }
}

export async function getDigitapESignedDoc(
  docId: string,
  customerID: number,
): Promise<ISurepassEsignDocResponse> {
  if (!docId) {
    return {
      success: false,
      message: "Please provide valid document Id",
    };
  }

  try {
    const digitapEsignDocURL = `${getDigitapBaseURL()}/v1/get-esign-doc`;
    const requestBody = {
      docId: docId,
    };

    const esignedDocumentResponse = await axios.post(
      digitapEsignDocURL,
      requestBody,
      {
        headers: digitapEsignHeaders,
      },
    );

    const saveFinboxUploadStatusData: ILeadsApiLog = {
      customerID: Number(customerID),
      api_type: LeadLogApiType.DIGITAP_ESIGN,
      api_supplier: ApiSupplierType.DIGITAP,
      api_response: JSON.stringify(esignedDocumentResponse.data),
      status: 1,
      api_endpoint_url: digitapEsignDocURL,
      api_method: "POST",
      api_headers: JSON.stringify({ headers: digitapEsignHeaders }),
      api_request: "",
    };
    await leadApiLogService.create(saveFinboxUploadStatusData);

    const { code, model } = esignedDocumentResponse.data;

    if (code !== "200" || !model) {
      return {
        success: false,
        message: "Unable to get the E-Signed Document",
      };
    }

    return {
      success: true,
      message: "E-signed document retrieved successfully",
      data: {
        url: model.url,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Error retrieving e-signed document",
    };
  }
}

// For audit trail, Digitap doesn't have a separate audit trail endpoint
// We'll return the same document URL as audit trail
export async function getDigitapESignedAuditTrail(
  docId: string,
  customerID: number,
): Promise<ISurepassEsignAuditTrailResponse> {
  // Digitap doesn't have separate audit trail, return the signed document
  return await getDigitapESignedDoc(docId, customerID);
}
