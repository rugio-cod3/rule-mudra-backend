import { customerService } from "@/services/customer.service";
import { leadService } from "@/services/lead.service";
// import { DigitapAccountAggregatorService } from "@/services/thirdParty/digitapAccountAggregator.service";
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
    const statusResponse = await digitapService.statusCheck(requestId);

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

  const statusResponse = await digitapService.statusCheck(requestId);

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

  const reportResponse = await digitapService.retrieveReport(txnId);

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

  return {
    status: true,
    message: "Bank BRE completed",
    data: {
      leadID,
      decision:
        credforgeResponse.output_data.rules_output.final_decision.Decision,
      offerAmount:
        credforgeResponse.output_data.rules_output.final_decision.LoanAmount,
      rawBankData: reportResponse.data,
      bankBreResponse: credforgeResponse,
    },
  };
}
