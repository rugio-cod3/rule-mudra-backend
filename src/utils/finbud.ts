import config from "@/config/default";
import { ApiSupplierType } from "@/enums/common.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import AxiosService from "@/services/api.service";
import LeadApiLogService from "@/services/lead_api_log.service";
import axios from "axios";
import { createDecipheriv } from "crypto";
import moment from "moment";
import {
  BureauInsightsRequest,
  IFinBudReportRequestPayload,
} from "../interfaces/finbud.interface";
const { v4: uuidv4 } = require("uuid");

const finBudApiService = new AxiosService(config.finbudBaseUrl);
const leadApiLogService = new LeadApiLogService();
const finBudHeader = {
  "Content-Type": "application/json",
  "x-api-key": config.finbudXAPIKEY,
};

export async function getCutomerReportFinbud(
  payload: IFinBudReportRequestPayload
): Promise<any> {
  const finBudURL = `${config.finbudBaseUrl}/report`;
  const { customerID } = payload;
  try {
    const firstName =
      payload.firstName && payload.firstName.trim()
        ? payload.firstName
        : payload.lastName;
    const finBudRequestBody = {
      userData: {
        phone: payload.phone,
        email: payload.email,
        pan: payload.pan,
        firstName,
        lastName: payload.lastName,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth,
      },
      reportRequest: {
        consentDetails: {
          consentFlag: true,
          consentTimestamp: moment().unix(),
        },
      },
      partnerMetadata: {
        partnerId: config.finbudPartnerId,
      },
    };
    const finBudResponse = await axios.post(finBudURL, finBudRequestBody, {
      headers: finBudHeader,
    });
    const { data } = finBudResponse;

    const finBudReport = data.report;
    const encryptedReport = finBudReport.encryptedReportJSONString;
    const decryptionIV = finBudReport.iv;
    if (encryptedReport) {
      const aesKeyBuffer = Buffer.from(config.finbudDecryptionKey, "hex");
      const decipher = createDecipheriv(
        "aes-256-cbc",
        aesKeyBuffer,
        Buffer.from(decryptionIV, "hex")
      );
      let decrypted = decipher.update(encryptedReport, "hex", "utf8");
      decrypted += decipher.final("utf8");
      const saveFinBudData: ILeadsApiLog = {
        customerID: customerID,
        api_type: LeadLogApiType.FINBUD_CREDIT_REPORT,
        api_supplier: ApiSupplierType.FINBUD,
        api_response: JSON.stringify(decrypted),
        status: 1,
        api_endpoint_url: finBudURL,
        api_method: "POST",
        api_headers: JSON.stringify({ headers: finBudHeader }),
        api_request: JSON.stringify(finBudRequestBody),
      };
      await leadApiLogService.create(saveFinBudData);
      return decrypted;
    }
  } catch (error) {
    console.log("Error", error.message);
    throw new Error("Error while fetching credit data with finbud");
  }
}

export async function fetchCredForgeBureauInsights(
  payload: BureauInsightsRequest
): Promise<any> {
  const { userId, referenceId, rawData, monthlyIncome, leadID } = payload;

  const credForgeURL = `${config.credforgeBaseUrl}/execute/varrenyam/bureau_mobile_bre`;
  const headers = {
    "Content-Type": "application/json",
  };
  const base64RawData = await encodeBase64(rawData);
  const referenceIdUUID = uuidv4();
  const credForgeRequestBody = {
    auth_token: config.credforgeAuthToken,
    client_id: config.credforgeClientId,
    user_id: `NC${userId}`,
    reference_id: `RF_${leadID}`,
    input_data: {
      lead_id: `NL${leadID}`,
      app_user_id: "",
      declared_income: monthlyIncome.toString(),
      external: {
        // bureau_type: `${BureauType.EXPERIAN_SOFTPULL}`,
        bureau_type: "experian_softpull_json_v2",
        bureau_raw_json: base64RawData,
      },
    },
  };

  const sanitizedCredForgeRequestBody = {
    ...credForgeRequestBody,
    input_data: {
      ...credForgeRequestBody.input_data,
      external: {
        ...credForgeRequestBody.input_data.external,
        bureau_raw_json: "REFER FINBUD RESPONSE",
      },
    },
  };

  try {
    const response = await axios.post(credForgeURL, credForgeRequestBody, {
      headers,
    });
    const saveCredForgeData: ILeadsApiLog = {
      customerID: Number(userId),
      api_type: LeadLogApiType.CREDFORGE_BUREAU_RAJAT,
      api_supplier: ApiSupplierType.CREDFORGE,
      api_response: JSON.stringify(response.data),
      status: 1,
      api_endpoint_url: credForgeURL,
      api_method: "POST",
      api_headers: JSON.stringify(headers),
      api_request: JSON.stringify(sanitizedCredForgeRequestBody),
    };
    await leadApiLogService.create(saveCredForgeData);
    return response.data;
  } catch (error) {
    console.error("Error fetching bureau insights:", error.message);
    throw error;
  }
}

function encodeBase64(
  data: string,
  encoding: BufferEncoding = "utf-8"
): string {
  return Buffer.from(data, encoding).toString("base64");
}

export async function fetchCredForgeBankBre(payload: any): Promise<any> {
  const { userId, referenceId, rawData, monthlyIncome, leadID } = payload;
  const credForgeBankBreURL = `${config.credforgeBaseUrl}/execute/varrenyam/bank_bre`;
  const headers = {
    "Content-Type": "application/json",
  };
  const referenceIdUUID = uuidv4();
  const credForgeRequestBody = {
    auth_token: config.credforgeAuthToken,
    client_id: config.credforgeClientId,
    user_id: `NC${userId}`,
    reference_id: `RF_${leadID}`,
    input_data: {
      lead_id: `NL${leadID}`,
      declared_income: monthlyIncome,
      external: {
        bank_type: `bank_aa`,
        bank_data: rawData,
      },
    },
  };

  const sanitizedCredForgeRequestBody = {
    ...credForgeRequestBody,
    input_data: {
      ...credForgeRequestBody.input_data,
      external: {
        ...credForgeRequestBody.input_data.external,
        bank_data: "BANK_DATA_REMOVED_FOR_DATA_SIZE",
      },
    },
  };

  try {
    const response = await axios.post(
      credForgeBankBreURL,
      credForgeRequestBody,
      {
        headers,
      }
    );
    const saveCredForgeBankBreData: ILeadsApiLog = {
      customerID: userId,
      api_type: LeadLogApiType.CREDFORGE_BUREAU_BANK_BRE_RAJAT,
      api_supplier: ApiSupplierType.CREDFORGE,
      api_endpoint_url: credForgeBankBreURL,
      api_method: "POST",
      status: 1,
      api_headers: JSON.stringify(headers),
      api_request: JSON.stringify(sanitizedCredForgeRequestBody),
      api_response: JSON.stringify(response.data),
    };
    await leadApiLogService.create(saveCredForgeBankBreData);
    return response.data;
  } catch (error) {
    console.error("Error fetching bureau insights:", error.message);
    throw error;
  }
}
