import config from "@/config/default";
import { ApprovalStatus } from "@/enums/approvalStatus.enum";
import { ApiSupplierType, BranchName } from "@/enums/common.enum";
import { nameCheckPercentage } from "@/enums/finbox.enum";
import {
  NameMatchType,
  NameSimilarityStatus,
} from "@/enums/finboxNameMatch.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { IApproval } from "@/interfaces/approval.interface";
import {
  IFinboxInitiateProcessingResponse,
  IFinboxSessionInitiateRequestPayload,
  IFinboxSessionInitiateResponse,
  IFinboxSessionProgressResponse,
  IFinboxSessionStatusResponse,
  IFinboxSessionUploadStatusResponse,
} from "@/interfaces/finbox_new.interface";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import { approvalService } from "@/services/approval.service";
import { customerService } from "@/services/customer.service";
import { customerNameMatchservice } from "@/services/customerNameMatch.service";
import { leadService } from "@/services/lead.service";
import LeadApiLogService from "@/services/lead_api_log.service";
import { finboxService } from "@/services/thirdParty/finbox.service";
import redisClient from "@/services/thirdParty/ioredis";
import { s3Service } from "@/services/thirdParty/s3.service";
import axios from "axios";
import moment from "moment";
import { documentFinboxmodel } from "../database/mysql/documentFinbox";
import { fetchCredForgeBankBre } from "../utils/finbud";
import { getNameMatchPercentage } from "./surePass.utils";

// const documentFinboxService = new documentFinboxmodel()
const leadApiLogService = new LeadApiLogService();
const finboxHeader = {
  "x-api-key": config.finboxXAPIKEY,
  "server-hash": config.finboxServerHash,
};

const finboxInitiateSessionHeader = {
  "Content-Type": "application/json",
};

const finboxBaseURL = config.finboxBaseUrl;
export async function finboxInitiateSession(
  payload: IFinboxSessionInitiateRequestPayload,
): Promise<IFinboxSessionInitiateResponse> {
  const finboxInititateSessionURL = `${finboxBaseURL}/bank-connect/v1/session/`;
  const { customerID } = payload;

  let getSessionResponse = await redisClient.getKey(
    `finbox_session_${customerID}`,
  );
  const session_id_from_redis = getSessionResponse?.session_id || "";
  if (!payload.session_expire) {
    if (getSessionResponse) {
      getSessionResponse = getSessionResponse;
      return {
        status: true,
        message: "Session from redis",
        data: {
          session_id: getSessionResponse.session_id,
          redirect_url: getSessionResponse.redirect_url,
        },
      };
    }
  }

  await redisClient.deleteKey(`finbox_session_${customerID}`);
  // if (session_id_from_redis) {
  //   await finboxSessionDelete(session_id_from_redis);
  // }
  await redisClient.deleteKey(`finbox_session_initiate_${customerID}`);

  const finboxInitiateSessionRequestBody = {
    api_key: config.finboxXAPIKEY,
    link_id: `nl-${customerID}`,
    from_date: payload.from_date,
    to_date: payload.to_date,
    redirect_url: payload.redirect_url,
  };

  const finboxInitiateSessionResponse = await axios.post(
    finboxInititateSessionURL,
    finboxInitiateSessionRequestBody,
    {
      headers: finboxInitiateSessionHeader,
    },
  );
  const { data } = finboxInitiateSessionResponse;
  const finboxRedirectURL = data.redirect_url;
  const finboxSessionId = data.session_id;
  await redisClient.setKey(
    `finbox_session_${customerID}`,
    {
      session_id: finboxSessionId,
      redirect_url: finboxRedirectURL,
    },
    600,
  );

  const saveFinboxInitiateSessionData: ILeadsApiLog = {
    customerID: Number(customerID),
    api_type: LeadLogApiType.FINBOX_SESSION_INITIATE,
    api_supplier: ApiSupplierType.FINBOX,
    api_response: JSON.stringify(finboxInitiateSessionResponse.data),
    status: 1,
    api_endpoint_url: finboxInititateSessionURL,
    api_method: "POST",
    api_headers: JSON.stringify({ headers: finboxInitiateSessionHeader }),
    api_request: JSON.stringify(finboxInitiateSessionRequestBody),
  };
  await leadApiLogService.create(saveFinboxInitiateSessionData);
  if (!data) {
    return {
      status: false,
      message: "Unable to initiate session",
      data: {
        retry: true,
      },
    };
  }
  return {
    status: true,
    message: "Session Created",
    data: {
      session_id: finboxSessionId,
      redirect_url: finboxRedirectURL,
    },
  };
}

export async function finboxBankConnectInitiate(
  session_id,
  customerID,
  leadID,
): Promise<any> {
  if (!session_id || !customerID) {
    return {
      status: false,
      message: "Session_id or customerID is missing",
    };
  }

  const customerData = await customerService.findOne({ customerID });
  const leadsData = await leadService.findOne({ customerID });

  if (!customerData || !leadsData) {
    return {
      status: false,
      message: "Customer data or lead data not found",
    };
  }

  const finboxInitiateProcessingResponse = await finboxInitiateProcessing(
    session_id,
    customerID,
  );
  if (!finboxInitiateProcessingResponse.status) {
    return {
      status: false,
      message:
        finboxInitiateProcessingResponse?.message ||
        "Unable to initiate the processing",
      data: {
        retry: true,
      },
    };
  }

  // Check session Status
  const sessionUploadStatusResponse = await finboxSessionUploadStatus(
    session_id,
    customerID,
  );
  if (!sessionUploadStatusResponse.status) {
    return {
      status: false,
      message:
        sessionUploadStatusResponse?.message ||
        "Unable to get the upload status",
      data: {
        retry: true,
      },
    };
  }

  if (sessionUploadStatusResponse.data.upload_status === "IN_PROGRESS") {
    return {
      status: false,
      message: "Upload status not completed",
      data: {
        session_id: sessionUploadStatusResponse.data.session_id,
        upload_status: sessionUploadStatusResponse.data.upload_status,
        retry: true,
      },
    };
  }

  // Check Session Progress
  const sessionProgressCheckResppnse = await finboxSessionProgress(
    session_id,
    customerID,
  );
  if (!sessionProgressCheckResppnse.status) {
    return {
      status: false,
      message:
        sessionProgressCheckResppnse?.message ||
        "Unable to get the session progress",
      data: {
        retry: true,
      },
    };
  }

  if (sessionProgressCheckResppnse.data.session_progress !== "completed") {
    return {
      status: false,
      message: "Session progress not completed",
      data: {
        session_id: sessionProgressCheckResppnse.data.session_id,
        session_progress: sessionProgressCheckResppnse.data.session_progress,
        retry: true,
      },
    };
  }

  // Check session Status
  const sessionStatusCheckResponse = await finboxSessionStatus(
    session_id,
    customerID,
  );
  if (!sessionStatusCheckResponse.status) {
    return {
      status: false,
      message:
        sessionStatusCheckResponse?.message ||
        "Unable to get the session Status",
      data: {
        retry: true,
      },
    };
  }

  if (!sessionStatusCheckResponse.data.insights_available) {
    return {
      status: false,
      message: "Session insight not ready",
      data: {
        session_id: sessionStatusCheckResponse.data.session_id,
        insights_available: sessionStatusCheckResponse.data.insights_available,
        accounts: sessionStatusCheckResponse.data.accounts,
        retry: true,
      },
    };
  }

  // Get Insights
  const sessionInsightsResponse = await finboxSessionInsight(
    session_id,
    customerID,
    leadID,
  );

  if (!sessionInsightsResponse.status) {
    return {
      status: false,
      message:
        sessionInsightsResponse?.message ||
        "Unable to fetch the session Insights",
      data: {
        retry: true,
      },
    };
  }

  if (
    sessionInsightsResponse.data?.link_id !== `nl-${customerID}` &&
    sessionInsightsResponse.data?.accounts?.length == 0
  ) {
    return {
      status: false,
      message:
        sessionInsightsResponse?.message || "Insights data is unavailable",
      data: {
        retry: true,
      },
    };
  }

  // Get PDFs
  /*   const sessionPdfsResponse = await finboxGetPdfs(
    session_id,
    customerID,
    leadID
  );
  if (!sessionPdfsResponse.status) {
    return {
      status: false,
      message:
        sessionPdfsResponse?.message || "Unable to fetch the session PDFs",
      data: {
        retry: true,
      },
    };
  } */

  const getLeadsInfo = await leadService.findOne({ customerID, leadID });
  if (!getLeadsInfo) {
    return {
      status: false,
      message: "Lead info not found, Check again",
      data: {
        return: true,
      },
    };
  }
  const credforgeResponse = await fetchCredForgeBankBre({
    userId: customerID.toString(),
    referenceId: customerID.toString(),
    rawData: sessionInsightsResponse.data.accounts,
    monthlyIncome: getLeadsInfo.monthlyIncome,
    leadID,
    // loanRequired: getLeadsInfo.loanRequeried,
  });

  if (!credforgeResponse) {
    return {
      status: false,
      message: credforgeResponse || "Unable to get the offer",
      data: {
        retry: true,
      },
    };
  }
  const finalBre = credforgeResponse?.output_data?.rules_output?.final_decision;
  let decision = finalBre.Decision;
  let offerAmount = finalBre.LoanAmount;
  if (offerAmount < config.min_loan_amount) {
    // decision = "Reject";
    offerAmount = config.min_loan_amount;
  }
  let finalLoanAmount;
  let maxLoanAmount = config.max_loan_amount || 18000;
  let loanAmtApproved =
    offerAmount > getLeadsInfo?.loanRequeried
      ? getLeadsInfo?.loanRequeried
      : offerAmount;
  finalLoanAmount =
    loanAmtApproved > maxLoanAmount ? maxLoanAmount : loanAmtApproved;
  // getLeadsInfo.loanRequeried = Math.min(getLeadsInfo.loanRequeried, 18000);
  // offerAmount = Math.min(offerAmount, getLeadsInfo.loanRequeried);
  if (decision === "Approve") {
    const approvedLoan = await approvalService.findOne({
      customerID,
      leadID: leadsData.leadID,
    });

    let salaryDate = customerData.salary_date ?? "5";
    let checkEmptyDate = 0;
    const repayDateData = await finboxService.repayDateFind(salaryDate);
    let formattedDate = repayDateData.formattedDate;
    let difference = repayDateData.difference;
    let finalOfferAmount = 0;
    if (finalLoanAmount) {
      const modOfferAmount = finalLoanAmount % 1000;
      if (modOfferAmount < 500) {
        finalOfferAmount = finalLoanAmount - modOfferAmount;
      } else if (modOfferAmount >= 500) {
        finalOfferAmount = finalLoanAmount + 1000 - modOfferAmount;
      }
    }
    const adminfee = (finalOfferAmount * 10) / 100;
    const gstOfAdminFee = (adminfee * 18) / 100;

    if (!approvedLoan) {
      const data: IApproval = {
        customerID,
        leadID,
        branch: BranchName.DELHI,
        loanAmtApproved: finalOfferAmount,
        tenure: checkEmptyDate === 0 ? difference : 0,
        roi: +config.rate_of_interest,
        repayDate: checkEmptyDate === 0 ? formattedDate : "0000-00-00",
        adminFee: adminfee,
        GstOfAdminFee: gstOfAdminFee,
        alternateMobile: String(customerData.mobile),
        officialEmail: customerData.email,
        cibil: 0,
        activeLoans: 0,
        status: ApprovalStatus.ApprovedProcess,
        remark: "",
        creditedBy: 1,
        employmentType: customerData.employeeType,
      };
      await approvalService.create(data);
      await leadService.updateOne(
        { customerID: customerID, leadID },
        { status: LeadStatus.APPROVED_PROCESS },
      );
    } else {
      if (approvedLoan.loanAmtApproved < finalOfferAmount) {
        await approvalService.updateOne(
          {
            approvalID: approvedLoan.approvalID,
            customerID: customerData.customerID,
            leadID,
          },
          {
            loanAmtApproved: finalOfferAmount,
            tenure: checkEmptyDate === 0 ? difference : 0,
            repayDate: checkEmptyDate === 0 ? formattedDate : "0000-00-00",
            adminFee: adminfee,
            GstOfAdminFee: gstOfAdminFee,
          },
        );
        await leadService.updateOne(
          { customerID: customerData.customerID, leadID },
          { status: LeadStatus.APPROVED_PROCESS },
        );
      }
    }
    return {
      status: true,
      message: sessionInsightsResponse.message,
      data: {
        leadID: leadID,
        status: true,
        decision,
        offerAmount: finalOfferAmount,
      },
    };
  } else {
    await leadService.updateOne(
      {
        customerID: customerData.customerID,
        leadID: leadsData.leadID,
      },
      {
        status: LeadStatus.REJECTED,
      },
    );
    return {
      status: false,
      message: sessionInsightsResponse.message,
      data: {
        loanID: leadID,
        status: false,
        decision,
        offerAmount: null,
      },
    };
  }
}

export async function finboxInitiateProcessing(
  session_id: string,
  customerID: string,
): Promise<IFinboxInitiateProcessingResponse | any> {
  const finboxInitiateProcessingURL = `${finboxBaseURL}/bank-connect/v1/session_data/${session_id}/initiate_processing/`;
  try {
    const getSessionFromRedis = await redisClient.getKey(
      `finbox_session_${customerID}`,
    );
    if (!getSessionFromRedis) {
      return {
        status: false,
        message: "Session Expired, Start Process again",
        data: {
          session_id: session_id,
        },
      };
    }

    const getSessionInitiateStatus = await redisClient.getKey(
      `finbox_session_initiate_${customerID}`,
    );
    if (getSessionInitiateStatus) {
      return {
        status: true,
        message: "Processing Already Initiated and Stored in redis",
        data: {
          session_id: session_id,
          message: "success",
        },
      };
    } else {
      const finboxInitiateProcessingResponse = await axios.post(
        finboxInitiateProcessingURL,
        null,
        {
          headers: {
            ...finboxHeader,
            "Content-Type": "application/json",
          },
        },
      );
      const data = finboxInitiateProcessingResponse.data;
      const saveFinboxInitiateSessionData: ILeadsApiLog = {
        customerID: Number(customerID),
        api_type: LeadLogApiType.FINBOX_SESSION_INITIATE,
        api_supplier: ApiSupplierType.FINBOX,
        api_response: JSON.stringify(finboxInitiateProcessingResponse.data),
        status: 1,
        api_endpoint_url: finboxInitiateProcessingURL,
        api_method: "POST",
        api_headers: JSON.stringify({ headers: finboxInitiateSessionHeader }),
        api_request: JSON.stringify(null),
      };
      await leadApiLogService.create(saveFinboxInitiateSessionData);
      if (!data) {
        return {
          status: false,
          message: "Unable to initate the request",
          data: {
            session_id: session_id,
          },
        };
      }

      await redisClient.setKey(
        `finbox_session_initiate_${customerID}`,
        {
          session_id: data.session_id,
          message: data.message,
        },
        600,
      );
      return {
        status: true,
        message: "Successfully Initiated the request",
        data: {
          session_id: session_id,
        },
      };
    }
    //   TODO: RAJESH Add in leads api log and error handling
  } catch (error) {
    const isAxiosErr = axios.isAxiosError(error);
    const res = isAxiosErr ? error.response?.data : null;

    const message =
      res?.error?.message ??
      res?.message ??
      (isAxiosErr
        ? `Finbox API returned status ${error.response?.status}`
        : "An unexpected error occurred while initiating processing.");

    const code = res?.error?.code ?? "UNKNOWN_ERROR";

    console.error("❌ Finbox Error:", {
      code,
      message,
      status: isAxiosErr ? error.response?.status : undefined,
    });

    return {
      status: false,
      message,
      data: { session_id, code },
    };
  }
}

export async function finboxSessionUploadStatus(
  session_id: string,
  customerID: string,
): Promise<IFinboxSessionUploadStatusResponse> {
  const finboxSessionUploadStatusURL = `${finboxBaseURL}/bank-connect/v1/session_data/${session_id}/session_upload_status/`;
  try {
    const getSessionFromRedis = await redisClient.getKey(
      `finbox_session_${customerID}`,
    );
    if (!getSessionFromRedis) {
      return {
        status: false,
        message: "Session Expired, Start Process again",
        data: {
          session_id: session_id,
          upload_status: "",
        },
      };
    }

    const finboxSessionUploadStatusResponse = await axios.get(
      finboxSessionUploadStatusURL,
      {
        headers: finboxHeader,
      },
    );

    const saveFinboxUploadStatusData: ILeadsApiLog = {
      customerID: Number(customerID),
      api_type: LeadLogApiType.FINBOX_UPLOAD_STATUS,
      api_supplier: ApiSupplierType.FINBOX,
      api_response: JSON.stringify(finboxSessionUploadStatusResponse.data),
      status: 1,
      api_endpoint_url: finboxSessionUploadStatusURL,
      api_method: "GET",
      api_headers: JSON.stringify({ headers: finboxHeader }),
      api_request: "",
    };
    await leadApiLogService.create(saveFinboxUploadStatusData);

    const data = finboxSessionUploadStatusResponse.data;
    if (!data) {
      return {
        status: false,
        message: "No status found",
        data: {
          session_id: session_id,
          upload_status: "",
        },
      };
    }
    return {
      status: true,
      message: "Session Upload Status",
      data: {
        session_id: session_id,
        upload_status: data.upload_status,
        accounts: data.accounts,
      },
    };
  } catch (error) {
    const isAxiosErr = axios.isAxiosError(error);
    const res = isAxiosErr ? error.response?.data : null;

    const message =
      res?.error?.message ??
      res?.message ??
      (isAxiosErr
        ? `Finbox API returned status ${error.response?.status}`
        : "An unexpected error occurred while initiating processing.");

    const code = res?.error?.code ?? "UNKNOWN_ERROR";

    console.error("❌ Finbox Error:", {
      code,
      message,
      status: isAxiosErr ? error.response?.status : undefined,
    });

    return {
      status: false,
      message,
      data: { session_id, upload_status: null },
    };
  }
}

export async function finboxSessionProgress(
  session_id: string,
  customerID: string,
): Promise<IFinboxSessionProgressResponse> {
  const finboxSessionProgressURL = `${finboxBaseURL}/bank-connect/v1/session_data/${session_id}/progress/`;
  const getSessionFromRedis = await redisClient.getKey(
    `finbox_session_${customerID}`,
  );
  if (!getSessionFromRedis) {
    return {
      status: false,
      message: "Session Expired, Start Process again",
      data: {
        session_id: session_id,
      },
    };
  }

  const finboxSessionProgressResponse = await axios.get(
    finboxSessionProgressURL,
    {
      headers: finboxHeader,
    },
  );

  const saveFinboxSessionProgressData: ILeadsApiLog = {
    customerID: Number(customerID),
    api_type: LeadLogApiType.FINBOX_SESSION_PROGRESS,
    api_supplier: ApiSupplierType.FINBOX,
    api_response: JSON.stringify(finboxSessionProgressResponse.data),
    status: 1,
    api_endpoint_url: finboxSessionProgressURL,
    api_method: "GET",
    api_headers: JSON.stringify({ headers: finboxHeader }),
    api_request: "",
  };
  await leadApiLogService.create(saveFinboxSessionProgressData);

  const { data } = finboxSessionProgressResponse;
  if (!data) {
    return {
      status: false,
      message: "No status found",
      data: {
        session_id: session_id,
      },
    };
  }

  return {
    status: true,
    message: "Session Progress",
    data: {
      session_id: session_id,
      session_progress: data.session_progress,
      progress: data.progress,
    },
  };
}

export async function finboxSessionStatus(
  session_id: string,
  customerID: string,
): Promise<IFinboxSessionStatusResponse> {
  const finboxSessionStatusURL = `${finboxBaseURL}/bank-connect/v1/session_data/${session_id}/session_status/`;
  const getSessionFromRedis = await redisClient.getKey(
    `finbox_session_${customerID}`,
  );
  if (!getSessionFromRedis) {
    return {
      status: false,
      message: "Session Expired, Start Process again",
      data: {
        session_id: session_id,
      },
    };
  }
  const finboxSessionStatusResponse = await axios.get(finboxSessionStatusURL, {
    headers: finboxHeader,
  });

  const saveFinboxSessionStatusData: ILeadsApiLog = {
    customerID: Number(customerID),
    api_type: LeadLogApiType.FINBOX_SESSION_STATUS,
    api_supplier: ApiSupplierType.FINBOX,
    api_response: JSON.stringify(finboxSessionStatusResponse.data),
    status: 1,
    api_endpoint_url: finboxSessionStatusURL,
    api_method: "GET",
    api_headers: JSON.stringify({ headers: finboxHeader }),
    api_request: "",
  };
  await leadApiLogService.create(saveFinboxSessionStatusData);

  const { data } = finboxSessionStatusResponse;
  if (!data) {
    return {
      status: false,
      message: "No data found",
      data: {
        session_id: session_id,
      },
    };
  }

  return {
    status: true,
    message: "Session Status",
    data: {
      session_id: session_id,
      insights_available: data.insights_available,
      accounts: data.accounts,
    },
  };
}

export async function finboxSessionInsight(
  session_id: string,
  customerID: string,
  leadID: string,
): Promise<any> {
  const finboxSessionInsightURL = `${finboxBaseURL}/bank-connect/v1/session_data/${session_id}/insights/`;
  const getSessionFromRedis = await redisClient.getKey(
    `finbox_session_${customerID}`,
  );
  if (!getSessionFromRedis) {
    return {
      status: false,
      message: "Session Expired, Start Process again",
      data: {
        session_id: session_id,
        upload_status: "",
      },
    };
  }

  const finboxSessionInsightResponse = await axios.get(
    finboxSessionInsightURL,
    {
      headers: finboxHeader,
    },
  );

  const saveFinboxSessionInsightData: ILeadsApiLog = {
    customerID: Number(customerID),
    api_type: LeadLogApiType.FINBOX_SESSION_INSIGHT,
    api_supplier: ApiSupplierType.FINBOX,
    api_response: JSON.stringify(finboxSessionInsightResponse.data),
    status: 1,
    api_endpoint_url: finboxSessionInsightURL,
    api_method: "GET",
    api_headers: JSON.stringify({ headers: finboxHeader }),
    api_request: "",
  };
  await leadApiLogService.create(saveFinboxSessionInsightData);

  const { data } = finboxSessionInsightResponse;
  if (!data) {
    return {
      status: false,
      message: "No Insight found",
      data: {
        session_id: session_id,
      },
    };
  }

  const accountHolderName =
    data.accounts?.[0]?.data?.account_details?.name?.trim() || "";

  if (accountHolderName) {
    const customerInfo = await customerService.findOne({
      customerID: Number(customerID),
    });
    const customerPanName = customerInfo.name;
    const customerAadhaarName = customerInfo.aadhaarName;

    const [panNameMatch, aadhaarNameMatch] = await Promise.all([
      getNameMatchPercentage(accountHolderName, customerPanName),
      getNameMatchPercentage(accountHolderName, customerAadhaarName),
    ]);
    const isPanNameMatch = panNameMatch >= 70;
    const isAadhaarNameMatch = aadhaarNameMatch >= 70;
    const isOverallMatch = isPanNameMatch || isAadhaarNameMatch;

    const panPercentageData = {
      errorCode: 0,
      errorMsg: "Successfully",
      firstName: accountHolderName,
      secondName: customerPanName,
      percentageConditionCheck: nameCheckPercentage,
      percentageResult: panNameMatch,
      status: isPanNameMatch
        ? NameSimilarityStatus.ACCEPT
        : NameSimilarityStatus.REJECT,
    };

    const aadhaarPercentageData = {
      errorCode: 0,
      errorMsg: "Successfully",
      firstName: accountHolderName,
      secondName: customerAadhaarName,
      percentageConditionCheck: nameCheckPercentage,
      percentageResult: aadhaarNameMatch,
      status: isAadhaarNameMatch
        ? NameSimilarityStatus.ACCEPT
        : NameSimilarityStatus.REJECT,
    };

    const nameMatchRecords = [
      // PAN name match record
      {
        lead_id: Number(leadID),
        customer_id: Number(customerID),
        mobile_no: customerInfo.mobile.toString(),
        type: NameMatchType.FINBOX_BANK_NAME_PAN,
        first_name: accountHolderName,
        second_name: customerPanName,
        percentage: panNameMatch.toString(),
        percentage_data: JSON.stringify(panPercentageData),
        status: isPanNameMatch ? 1 : 0,
      },
      // Aadhaar name match record
      {
        lead_id: Number(leadID),
        customer_id: Number(customerID),
        mobile_no: customerInfo.mobile.toString(),
        type: NameMatchType.FINBOX_BANK_NAME_AADHAAR,
        first_name: accountHolderName,
        second_name: customerAadhaarName,
        percentage: aadhaarNameMatch.toString(),
        percentage_data: JSON.stringify(aadhaarPercentageData),
        status: isAadhaarNameMatch ? 1 : 0,
      },
    ];
    await Promise.all([
      customerNameMatchservice.create(nameMatchRecords[0]),
      customerNameMatchservice.create(nameMatchRecords[1]),
    ]);
    if (!isOverallMatch) {
      return {
        status: false,
        message: "Account holder name does not match PAN or Aadhaar records",
        data: {
          session_id: session_id,
        },
      };
    }
  }
  return {
    status: true,
    message: "Session Insight",
    data: {
      session_id: session_id,
      link_id: data.link_id,
      accounts: data.accounts,
      aggregate_monthly_analysis: data.aggregate_monthly_analysis,
      aggregate_xlsx_report_url: data.aggregate_xlsx_report_url,
    },
  };
}

/* export async function finboxSessionDelete(session_id: string): Promise<any> {
  const finboxSessioDeleteURL = `${finboxBaseURL}/bank-connect/v1/session_data/${session_id}/delete/`;
  const finboxSessionDeleteResponse = await axios.delete(
    finboxSessioDeleteURL,
    { headers: finboxHeader },
  );
  const { data } = finboxSessionDeleteResponse;
  if (!data) {
    return {
      status: false,
      message: "Session not found",
      data: {
        session_id: session_id,
      },
    };
  }
  return {
    status: true,
    message: "Session deleted successfully!!",
    data: null,
  };
} */

export async function finboxGetPdfs(
  session_id: string,
  customerID: string,
  leadID: string,
): Promise<any> {
  const finboxGetPdfsURL = `${finboxBaseURL}/bank-connect/v1/session_data/${session_id}/get_pdfs/`;
  const finboxGetPdfsResponse = await axios.get(finboxGetPdfsURL, {
    headers: finboxHeader,
  });
  const { data } = finboxGetPdfsResponse;
  if (!data) {
    return {
      status: false,
      message: "Pdfs data not ready",
      data: {
        session_id: session_id,
      },
    };
  }
  if (data.statements.length) {
    const statements = data?.statements;
    for (const statement of statements) {
      const { statement_id, pdf_url, bank_name, pdf_password, account_id } =
        statement;
      const s3UploadResponse = await s3Service.uploadFromSignedUrl(
        pdf_url,
        `documents/finbox/${customerID}`,
        `${bank_name}_${statement_id}.pdf`,
        false,
      );
      // const s3signedURL = await s3Service.getPresignedUrl(s3UploadResponse.Key);
      // console.log("s3signedURL===========>", s3signedURL);
      let documentFinboxData = {
        customerID: Number(customerID),
        leadID: Number(leadID),
        entityID: session_id,
        type: "pdf",
        statement_id: statement_id,
        documentType: "Bank Statement",
        documentFile: s3UploadResponse.Key,
        verifiedBy: "finbox",
        verifiedDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        status: "Verified",
        password: pdf_password ? pdf_password : null,
      };
      await documentFinboxmodel.insert(documentFinboxData);
    }
    return {
      status: true,
      message: "pdf saved successfully",
      data: {
        session_id: session_id,
      },
    };
  }
}
