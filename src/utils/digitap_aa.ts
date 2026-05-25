import { customerService } from "@/services/customer.service";
import { leadService } from "@/services/lead.service";
// import { DigitapAccountAggregatorService } from "@/services/thirdParty/digitapAccountAggregator.service";
import config from "@/config/default";
import { ApprovalStatus } from "@/enums/approvalStatus.enum";
import { BranchName } from "@/enums/common.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { IApproval } from "@/interfaces/approval.interface";
import { approvalService } from "@/services/approval.service";
import { finboxService } from "@/services/thirdParty/finbox.service";
import redisClient from "@/services/thirdParty/ioredis";
import { fetchCredForgeBankBre } from "@/utils/finbud";
import { cwd } from "process";
import { DigitapAccountAggregatorService } from "./digitap_aa_service";
require("dotenv").config({ path: cwd() + "/.env" });

export async function digitapAACreateUrl(payload: {
  customerID: number;
  leadID: number;
  callBackUrl: string;
  session_expire?: boolean;
}) {
  const { customerID, leadID, callBackUrl, session_expire } = payload;

  const redisKey = `digitap_aa_session_${customerID}_${leadID}`;

  if (!session_expire) {
    const cachedSession = await redisClient.getKey(redisKey);

    if (cachedSession?.request_id && cachedSession?.redirect_url) {
      return {
        status: true,
        message: "Digitap AA session from redis",
        data: cachedSession,
      };
    }
  }

  await redisClient.deleteKey(redisKey);

  const customerData = await customerService.findOne({ customerID });
  if (!customerData) {
    return {
      status: false,
      message: "Customer data not found",
    };
  }

  const digitapService = new DigitapAccountAggregatorService({
    baseURL: process.env.DIGITAP_AA_BASE_URL,
    clientID: process.env.DIGITAP_CLIENT_ID!,
    clientSecret: process.env.DIGITAP_CLIENT_SECRET!,
  });

  const response = await digitapService.generateUrl({
    customerID,
    leadID,
    mobile: String(customerData.mobile),
    returnUrl: `${callBackUrl}?request_id=%s&txn_id=%s&success=%s`,
    callbackUrl: process.env.DIGITAP_AA_TXN_COMPLETED_CALLBACK_URL!,
  });

  if (!response.status) {
    return response;
  }

  await redisClient.setKey(redisKey, response.data, 600);

  return response;
}

export async function digitapAABankConnect(payload: {
  customerID: number;
  leadID: number;
  requestId: string;
  txn_id: string;
}) {
  const { customerID, leadID, requestId, txn_id } = payload;

  let finalTxnId = txn_id;

  if (!requestId) {
    return {
      status: false,
      message: "request_id is missing",
    };
  }

  const customerData = await customerService.findOne({ customerID });
  const leadData = await leadService.findOne({ customerID, leadID });

  if (!customerData || !leadData) {
    return {
      status: false,
      message: "Customer or lead data not found",
    };
  }

  const digitapService = new DigitapAccountAggregatorService({
    baseURL: process.env.DIGITAP_AA_BASE_URL,
    clientID: process.env.DIGITAP_CLIENT_ID!,
    clientSecret: process.env.DIGITAP_CLIENT_SECRET!,
  });

  if (!finalTxnId) {
    const statusResponse = await digitapService.statusCheck(requestId, {
      customerID,
      leadID,
    });

    if (!statusResponse.status) {
      return {
        status: false,
        message: statusResponse.message,
        data: {
          retry: statusResponse.data?.retry ?? true,
          request_id: requestId,
          digitap_status: statusResponse.data,
        },
      };
    }

    finalTxnId = statusResponse.data?.txn_id;
  }

  const statusResponse = await digitapService.statusCheck(requestId, {
    customerID,
    leadID,
  });

  if (!statusResponse.status) {
    return {
      status: false,
      message: statusResponse.message,
      data: {
        retry: statusResponse.data?.retry ?? true,
        request_id: requestId,
        digitap_status: statusResponse.data,
      },
    };
  }

  const txnId = statusResponse.data?.txn_id;

  const reportResponse = await digitapService.retrieveReport(txnId, {
    customerID,
    leadID,
  });

  if (!reportResponse.status) {
    return {
      status: false,
      message: reportResponse.message,
      data: {
        retry: true,
        request_id: requestId,
        txn_id: txnId,
      },
    };
  }

  const credforgeResponse = await fetchCredForgeBankBre({
    userId: customerID.toString(),
    referenceId: leadID.toString(),
    rawData: reportResponse.data,
    monthlyIncome: leadData.monthlyIncome,
    leadID: leadID.toString(),
  });

  if (!credforgeResponse?.output_data?.rules_output?.final_decision) {
    return {
      status: false,
      message: "Unable to get Bank BRE decision",
      data: {
        retry: true,
      },
    };
  }

  const finalBankBre =
    credforgeResponse?.output_data?.rules_output?.final_decision;

  if (!finalBankBre) {
    return {
      status: false,
      message: "Unable to get Bank BRE decision",
      data: {
        retry: true,
      },
    };
  }

  const decision = finalBankBre.Decision;
  const offerAmount = Number(finalBankBre.LoanAmount || 0);

  await createOrUpdateApprovalAfterBankBre({
    customerID,
    leadID,
    decision,
    offerAmount,
    customerData,
    getLeadsInfo: leadData,
    message: "Digitap Bank BRE completed",
  });

  return {
    status: true,
    message: "Bank BRE completed",
    data: {
      leadID,
      decision:
        credforgeResponse.output_data.rules_output.final_decision.Decision,
      offerAmount:
        credforgeResponse.output_data.rules_output.final_decision.LoanAmount,
      //   rawBankData: reportResponse.data,
      //   bankBreResponse: credforgeResponse,
    },
  };
}

async function createOrUpdateApprovalAfterBankBre(payload: {
  customerID: number;
  leadID: number;
  decision: string;
  offerAmount: number;
  customerData: any;
  getLeadsInfo: any;
  message: string;
}) {
  const { customerID, leadID, decision, customerData, getLeadsInfo, message } =
    payload;

  let offerAmount = Number(payload.offerAmount || 0);

  if (offerAmount < config.min_loan_amount) {
    offerAmount = Number(config.min_loan_amount);
  }

  const maxLoanAmount = Number(config.max_loan_amount || 18000);
  const requestedAmount = Number(getLeadsInfo?.loanRequeried || 0);

  const loanAmtApproved =
    offerAmount > requestedAmount ? requestedAmount : offerAmount;

  let finalLoanAmount =
    loanAmtApproved > maxLoanAmount ? maxLoanAmount : loanAmtApproved;

  if (decision === "Approve") {
    const approvedLoan = await approvalService.findOne({
      customerID,
      leadID,
    });

    const salaryDate = customerData.salary_date ?? "5";
    const checkEmptyDate = 0;

    const repayDateData = await finboxService.repayDateFind(String(salaryDate));

    const formattedDate = repayDateData.formattedDate;
    const difference = repayDateData.difference;

    let finalOfferAmount = 0;

    if (finalLoanAmount) {
      const modOfferAmount = finalLoanAmount % 1000;

      if (modOfferAmount < 500) {
        finalOfferAmount = finalLoanAmount - modOfferAmount;
      } else {
        finalOfferAmount = finalLoanAmount + 1000 - modOfferAmount;
      }
    }

    const adminfee = (finalOfferAmount * 10) / 100;
    const gstOfAdminFee = (adminfee * 18) / 100;

    if (!approvedLoan) {
      const data: IApproval = {
        customerID,
        leadID,
        branch: BranchName.NOIDA,
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
        { customerID, leadID },
        { status: LeadStatus.APPROVED_PROCESS },
      );
    } else if (Number(approvedLoan.loanAmtApproved || 0) < finalOfferAmount) {
      await approvalService.updateOne(
        {
          approvalID: approvedLoan.approvalID,
          customerID,
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
        { customerID, leadID },
        { status: LeadStatus.APPROVED_PROCESS },
      );
    }

    return {
      status: true,
      message,
      data: {
        leadID,
        status: true,
        decision,
        offerAmount: finalOfferAmount,
      },
    };
  }

  await leadService.updateOne(
    {
      customerID,
      leadID,
    },
    {
      status: LeadStatus.REJECTED,
    },
  );

  return {
    status: false,
    message,
    data: {
      loanID: leadID,
      status: false,
      decision,
      offerAmount: null,
    },
  };
}
