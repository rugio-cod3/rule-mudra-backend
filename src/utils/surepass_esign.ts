import config from "@/config/default";
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
import { OnboardingService } from "@/services/onboarding.service";
import { s3Service } from "@/services/thirdParty/s3.service";
import FinboxService from "@/services/thirdParty/finbox.service";
import axios from "axios";
import ejs from "ejs";
import path from "path";
import puppeteer from "puppeteer";
import { getKnexInstance } from "./mysql";

const surePassEsignBaseURL = config.surepassDigitalEsignBaseURL;
const surepassEsignHeader = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${config.surepassNewToken}`,
};

export async function surepassDigitalEsignInitialize(
  payload: ISurepassEsignInitiateRequestPayload
): Promise<ISurepassEsignInitiateResponse> {
  const surepassEsignInitializeURL = `${surePassEsignBaseURL}/api/v1/esign/initialize`;
  const { customerID } = payload;
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
    [{ column: "leadID", order: "desc" }]
  );
  const surepassEsignInitializeBody = {
    pdf_pre_uploaded: true,
    callback_url: payload.callback_url,
    config: {
      accept_virtual_sign: true,
      track_location: true,
      auth_mode: "1",
      reason: "Loan Agreement",
      positions: {
        "8": [
          {
            x: 350,
            y: 30,
          },
        ],
      },
    },
    prefill_options: {
      full_name: getCustomerInfo.name,
      mobile_number: getCustomerInfo.mobile.toString(),
      user_email: getCustomerInfo.email,
    },
  };
  let surepassEsignResponse = await axios.post(
    surepassEsignInitializeURL,
    surepassEsignInitializeBody,
    { headers: surepassEsignHeader }
  );
  const { data, status_code, message, success } = surepassEsignResponse.data;
  if (status_code === 200 && success) {
    const { client_id, token, url } = data;
    const getAggrementPdfLink = await generateAggrementPdf(
      customerID,
      getLeadInfo.leadID
    );
    if (!getAggrementPdfLink.status) {
      return getAggrementPdfLink;
    }
    const { status, data: aggrementLink } = getAggrementPdfLink;
    const surepassEsignUploadDocByLink = `${surePassEsignBaseURL}/api/v1/esign/upload-pdf`;
    const uploadAggrementFile = await axios.post(
      surepassEsignUploadDocByLink,
      {
        client_id,
        link: aggrementLink,
      },
      { headers: surepassEsignHeader }
    );
    const {
      data: uploadData,
      status_code: upload_status_code,
      message: upload_message,
      success: upload_success,
    } = uploadAggrementFile.data;
    if (upload_status_code === 200 && upload_success && uploadData.uploaded) {
      return {
        success: true,
        status_code: 200,
        message: "Surepass ESing URL generated",
        data: {
          client_id,
          url,
          token,
        },
      };
    }
  } else {
    return surepassEsignResponse.data;
  }
}

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

  const repayDateResult = await finboxService.repayDateFind(customerInfo.salary_date?.toString());

  await approvalService.updateOne(
    {
      customerID: customerID,
      leadID: leadId,
    },
    {
      repayDate: repayDateResult.formattedDate,
      tenure: repayDateResult.difference
    }
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
    // interestRate: loanData?.interest || 300,
    interestRate: +config.rate_of_interest,

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
    // totalRepaymentAmount: leadInfo?.totalRepaymentAmount || null,
    totalRepaymentAmount: null,
  };

  return {
    status: true,
    message: "Agreement data prepared",
    data: res,
  };
}

async function generateAggrementPdf(
  customerID: number,
  leadID: number
): Promise<any> {
  let browser = null;
  try {
    const aggrementDataRes = await aggrementData(leadID, customerID);
    console.log(
      "agreement data --------------------------------->",
      aggrementDataRes
    );
    if (!aggrementDataRes.status) {
      console.error(
        "[AggrementPDF] aggrementDataRes.status is false:",
        aggrementDataRes
      );
      return { status: false, message: "Agreement data not found" };
    }

    const templatePath = path.resolve(
      __dirname,
      "../views/loansDocs/new_loan_aggrement.ejs"
    );
    console.log("[AggrementPDF] Using templatePath:", templatePath);

    const fs = require("fs");
    try {
      const templateContent = fs.readFileSync(templatePath, "utf8");
      console.log(
        "[AggrementPDF] Template file first 200 chars:\n",
        templateContent.slice(0, 200)
      );
    } catch (err) {
      console.error("[AggrementPDF] Error reading template file:", err);
    }

    console.log(
      "[AggrementPDF] Data passed to EJS:",
      JSON.stringify(aggrementDataRes.data, null, 2)
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
      `agreement_${Date.now()}.pdf`
    );
    const signedUrl = await s3Service.getPresignedUrl(s3Key);

    const onboardingService = new OnboardingService();
    try {
      await onboardingService.generatePaydayKfs({
        leadId: leadID,
        customerId: customerID,
        uploadDocs: true
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

export async function getEsignStatus(
  client_id: string
): Promise<ISurepassEsignStatusResponse> {
  if (!client_id) {
    return {
      success: false,
      message: "Please provide valid client Id",
    };
  }
  const surepassESignStatusURL = `${surePassEsignBaseURL}/api/v1/esign/status/${client_id}`;
  try {
    const esignStatusResponse = await axios.get(surepassESignStatusURL, {
      headers: surepassEsignHeader,
    });
    const { data, status_code, message, success } = esignStatusResponse.data;
    if (status_code !== 200 || !success) {
      return {
        success: false,
        message: message || "Unable to get the Esign status",
      };
    }
    return {
      success: true,
      message: message,
      data: {
        client_id: data.client_id,
        status: data.status,
        completed: data.completed,
        esign_error: data.esign_error,
        error_message_from_nsdl: data.error_message_from_nsdl,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Error in catch of esign status",
    };
  }
}

export async function getEsignReport(
  client_id: string
): Promise<ISurepassEsignReportResponse> {
  if (!client_id) {
    return {
      success: false,
      message: "Please provide valid client Id",
    };
  }
  const surepassESignReportURL = `${surePassEsignBaseURL}/api/v1/esign/report/${client_id}`;
  try {
    const surepassESignReportRequestBody = {
      categories: ["name_match"],
    };
    const esignReportResponse = await axios.post(
      surepassESignReportURL,
      surepassESignReportRequestBody,
      {
        headers: surepassEsignHeader,
      }
    );
    const { data, status_code, message, success } = esignReportResponse.data;
    if (status_code !== 200 || !success) {
      return {
        success: false,
        message: message || "Unable to get the Esign Report",
      };
    }
    const esignReportData = data?.reports?.name_match;
    return {
      success: true,
      message: message,
      data: {
        client_id: data.client_id,
        status: data.status,
        name_match: {
          name: esignReportData?.name || "",
          name_matched: esignReportData?.name_matched || false,
          name_match_score: esignReportData?.name_match_score || "",
          aaadhar_last_four_digits:
            esignReportData?.certificate_details?.aaadhar_last_four_digits ||
            "",
          year_of_birth:
            esignReportData?.certificate_details?.year_of_birth || "",
          gender: esignReportData?.certificate_details?.gender || "",
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Error in catch of esign report",
    };
  }
}

export async function getESignedDoc(
  client_id: string
): Promise<ISurepassEsignDocResponse> {
  if (!client_id) {
    return {
      success: false,
      message: "Please provide valid client Id",
    };
  }
  const surepassESignDocumentURL = `${surePassEsignBaseURL}/api/v1/esign/get-signed-document/${client_id}`;
  const esignedDocumentResponse = await axios.get(surepassESignDocumentURL, {
    headers: surepassEsignHeader,
  });
  const { data, status_code, message, success } = esignedDocumentResponse.data;
  if (status_code !== 200 || !success) {
    return {
      success: false,
      message: message || "Unable to get the ESinged Document",
    };
  }
  return {
    success: true,
    message: message,
    data: {
      url: data.url,
    },
  };
}

export async function getESignedAuditTrail(
  client_id: string
): Promise<ISurepassEsignAuditTrailResponse> {
  if (!client_id) {
    return {
      success: false,
      message: "Please provide valid client Id",
    };
  }
  const surepassESignDocumentURL = `${surePassEsignBaseURL}/api/v1/esign/audit-trail/${client_id}`;
  const esignedDocumentResponse = await axios.get(surepassESignDocumentURL, {
    headers: surepassEsignHeader,
  });
  const { data, status_code, message, success } = esignedDocumentResponse.data;
  if (status_code !== 200 || !success) {
    return {
      success: false,
      message: message || "Unable to get the ESinged Audit Trail Document",
    };
  }
  return {
    success: true,
    message: message,
    data: {
      url: data.url,
    },
  };
}
