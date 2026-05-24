import config from "@/config/default";
import {
  ApiSupplierType,
  DigitapApiUrl,
  SurePassApiUrl,
} from "@/enums/common.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import {
  IApiResponseDigitapPan,
  ISurePassValidatePan,
  ISurePassValidatePanResponse,
} from "@/interfaces/onboarding.interface";
import AxiosService from "@/services/api.service";
import LeadApiLogService from "@/services/lead_api_log.service";
import { InsertData } from "@/types/model.types";
import axios from "axios";
import { replaceNameClippingsRe } from "./util";
const leadApiLogService = new LeadApiLogService();
const apiService = new AxiosService(config.surePassApi);
const digitapApiService = new AxiosService(config.digitapPanVerificationApi);

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${config.surePassToken}`,
};

const digitapAuth = Buffer.from(
  `${config.digitapClientId}:${config.digitapClientSecret}`
).toString("base64");
// change this also
const headersDigitap = {
  "Content-Type": "application/json",
  Authorization: `Basic ${digitapAuth}`,
};

export async function generateAadharOtpBySurepass(
  aadharNo: string,
  customerID: number
): Promise<any> {
  const url = config.surePassApi + "/api/v1/aadhaar-v2/generate-otp";
  try {
    const response = await axios.post(
      url,
      {
        id_number: aadharNo,
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${config.surePassToken}`,
        },
      }
    );
    const { data } = response;
    let saveObject = {
      customerID: customerID,
      api_type: "aadhaar-v2-generate-otp",
      api_supplier: 4,
      api_response: JSON.stringify(data),
      status: 1,
      api_endpoint_url: url,
      api_method: "POST",
      api_headers: JSON.stringify({
        "content-type": "application/json",
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        id_number: aadharNo,
      }),
    };
    await leadApiLogService.create(saveObject);
    return data;
  } catch (error) {
    console.log("Error", error.message);
    throw new Error("Error while generating otp through surePass");
  }
}

export async function verifyAadharOtpBySurepass(
  otp: string,
  customerId: number
): Promise<any> {
  let logData = await leadApiLogService.findOne(
    { customerID: customerId, status: 1, api_type: "aadhaar-v2-generate-otp" },
    ["api_response"],
    [{ column: "id", order: "desc" }]
  );
  const apiResponse = JSON.parse(logData.api_response);
  const url = config.surePassApi + "/api/v1/aadhaar-v2/submit-otp";
  try {
    const response = await axios.post(
      url,
      {
        client_id: apiResponse?.data.client_id,
        otp: otp,
        aadhaar_pdf_generate: true,
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${config.surePassToken}`,
        },
      }
    );
    const { data } = response;
    let saveObject = {
      customerID: customerId,
      api_type: "aadhaar-v2-submit-otp",
      api_supplier: 4,
      api_response: JSON.stringify(data),
      status: 1,
      api_endpoint_url: url,
      api_method: "POST",
      api_headers: JSON.stringify({
        "content-type": "application/json",
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        client_id: apiResponse?.data?.client_id,
        otp: otp,
      }),
      aadharNo: data?.data?.aadhaar_number,
    };
    await leadApiLogService.create(saveObject);
    return data;
  } catch (error) {
    console.log("Error", error);
    throw new Error("Error while verifying otp through surePass");
  }
}
export async function verifyPanSurePass(payload: ISurePassValidatePan) {
  const { panNumber, customerId, mobileNo } = payload;
  const result = await apiService.call<
    ISurePassValidatePanResponse,
    { id_number: string },
    undefined
  >(
    "post",
    SurePassApiUrl.PAN_COMPREHENSIVE,
    {
      id_number: panNumber,
    },
    undefined,
    headers
  );

  let saveObject: InsertData<ILeadsApiLog> = {
    customerID: customerId,
    api_type: LeadLogApiType.PAN_COMPREHENSIVE,
    api_supplier: ApiSupplierType.SUREPASS,
    api_response: JSON.stringify(result.data),
    status: result.success ? 1 : 0,
    api_endpoint_url: config.surePassApi + SurePassApiUrl.PAN_COMPREHENSIVE,
    api_method: "POST",
    api_headers: JSON.stringify(headers),
    api_request: JSON.stringify({
      id_number: panNumber,
    }),
    mobile_no: String(mobileNo),
    pancard: panNumber,
  };

  await leadApiLogService.create(saveObject);

  return result;
}

export async function ckycSearchBySurePass(
  panNumber: string,
  customerId: number,
  mobileNumber: number
): Promise<any> {
  const url = `${config.surePassApi}/api/v1/ckyc/search`;
  try {
    const response = await axios.post(
      url,
      {
        id_number: panNumber,
        document_type: "PAN",
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${config.surePassToken}`,
        },
      }
    );
    const { data } = response;
    let saveObject = {
      customerID: customerId,
      api_type: "ckyc_search",
      api_supplier: 4,
      api_response: JSON.stringify(data),
      status: 1,
      api_endpoint_url: url,
      api_method: "POST",
      api_headers: JSON.stringify({
        "content-type": "application/json",
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        id_number: panNumber,
        document_type: "PAN",
      }),
      pancard: panNumber,
      mobile_no: String(mobileNumber),
    };
    await leadApiLogService.create(saveObject);
    return data;
  } catch (error) {
    console.log("Error", error);
    throw new Error("Error while verifying pan through surePass");
  }
}
export async function ckycDownloadBySurePass(
  dob: string,
  customerId: number,
  mobileNumber: number
): Promise<any> {
  let logData = await leadApiLogService.findOne(
    { customerID: customerId, status: 1, api_type: "ckyc_search" },
    ["api_response"],
    [{ column: "id", order: "desc" }]
  );
  const apiResponse = JSON.parse(logData.api_response);
  const url = `${config.surePassApi}/api/v1/ckyc/download`;
  try {
    const response = await axios.post(
      url,
      {
        client_id: apiResponse?.data.client_id,
        dob: dob,
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${config.surePassToken}`,
        },
      }
    );
    const { data } = response;
    let saveObject = {
      customerID: customerId,
      api_type: "ckyc_download",
      api_supplier: 4,
      api_response: JSON.stringify(data),
      status: 1,
      api_endpoint_url: url,
      api_method: "POST",
      api_headers: JSON.stringify({
        "content-type": "application/json",
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        client_id: apiResponse?.data.client_id,
        dob: dob,
      }),
      mobile_no: String(mobileNumber),
    };
    await leadApiLogService.create(saveObject);
    return data;
  } catch (error) {
    console.log("Error", error);
    throw new Error("Error while verifying pan through surePass");
  }
}
export async function verifyPanDigitap(payload: ISurePassValidatePan) {
  const { panNumber, customerId, mobileNo } = payload;
  const result = await digitapApiService.call<
    IApiResponseDigitapPan,
    { pan: string; client_ref_num: string },
    undefined
  >(
    "post",
    DigitapApiUrl.PAN_COMPREHENSIVE,
    {
      pan: panNumber,
      client_ref_num: `customer${panNumber}`, //testapis-b0crd
    },
    undefined,
    headersDigitap
  );
  let saveObject: InsertData<ILeadsApiLog> = {
    customerID: customerId,
    api_type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
    api_supplier: ApiSupplierType.SUREPASS,
    api_response: JSON.stringify(result.data),
    status: result.success ? 1 : 0,
    api_endpoint_url:
      config.digitapPanVerificationApi + DigitapApiUrl.PAN_COMPREHENSIVE,
    api_method: "POST",
    api_headers: JSON.stringify(headers),
    api_request: JSON.stringify({
      id_number: panNumber,
    }),
    mobile_no: String(mobileNo),
    pancard: panNumber,
  };

  await leadApiLogService.create(saveObject);

  return result;
}

// export async function getNameMatchPercentage(
//   name1: string,
//   name2: string
// ): Promise<number> {
//   if (!name1 || !name2) {
//     throw new Error("Please provide both name to compare");
//   }
//   let a = name1.toLowerCase().trim();
//   let b = name2.toLowerCase().trim();

//   a = replaceNameClippingsRe(a);
//   b = replaceNameClippingsRe(b);

//   const distance: number = await getLevenshteinDistance(a, b);
//   const maxLength: number = Math.max(a.length, b.length);

//   const similarity: number = maxLength === 0 ? 1 : 1 - distance / maxLength;

//   return Math.round(similarity * 100);
// }

// async function getLevenshteinDistance(a: string, b: string) {
//   const m = a.length;
//   const n = b.length;

//   const dp: number[][] = Array.from({ length: m + 1 }, () =>
//     new Array(n + 1).fill(0)
//   );

//   for (let i = 0; i <= m; i++) dp[i][0] = i;
//   for (let j = 0; j <= n; j++) dp[0][j] = j;

//   for (let i = 1; i <= m; i++) {
//     for (let j = 1; j <= n; j++) {
//       const cost = a[i - 1] === b[j - 1] ? 0 : 1;

//       dp[i][j] = Math.min(
//         dp[i - 1][j] + 1,
//         dp[i][j - 1] + 1,
//         dp[i - 1][j - 1] + cost
//       );
//     }
//   }

//   return dp[m][n];
// }

export async function getNameMatchPercentage(
  name1: string,
  name2: string
): Promise<number> {
  if (!name1 || !name2) {
    throw new Error("Please provide both name to compare");
  }

  let a = name1.toLowerCase().trim();
  let b = name2.toLowerCase().trim();

  a = replaceNameClippingsRe(a);
  b = replaceNameClippingsRe(b);

  if (a === b) {
    return 100;
  }

  const tokenSimilarity = await getTokenBasedSimilarity(a, b);
  if (tokenSimilarity === 100) {
    return 100;
  }
  const jaroWinklerSimilarity = await getJaroWinklerSimilarity(a, b);
  return Math.round(jaroWinklerSimilarity);
}

async function getTokenBasedSimilarity(
  name1: string,
  name2: string
): Promise<number> {
  const tokens1 = new Set(
    name1.split(/\s+/).filter((token) => token.length > 0)
  );
  const tokens2 = new Set(
    name2.split(/\s+/).filter((token) => token.length > 0)
  );

  if (tokens1.size === 0 && tokens2.size === 0) {
    return 100;
  }
  if (tokens1.size === 0 || tokens2.size === 0) {
    return 0;
  }

  if (
    tokens1.size === tokens2.size &&
    [...tokens1].every((token) => tokens2.has(token))
  ) {
    return 100;
  }
  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  return (intersection.size / union.size) * 100;
}

async function getJaroWinklerSimilarity(
  s1: string,
  s2: string
): Promise<number> {
  function jaroSimilarity(s1: string, s2: string): number {
    if (s1 === s2) return 1.0;

    const len1 = s1.length;
    const len2 = s2.length;
    if (len1 === 0 || len2 === 0) return 0.0;

    const matchDistance = Math.max(0, Math.floor(Math.max(len1, len2) / 2) - 1);
    const s1Matches: boolean[] = new Array(len1).fill(false);
    const s2Matches: boolean[] = new Array(len2).fill(false);

    let matches = 0;
    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, len2);

      for (let j = start; j < end; j++) {
        if (s2Matches[j] || s1[i] !== s2[j]) continue;
        s1Matches[i] = s2Matches[j] = true;
        matches++;
        break;
      }
    }

    if (matches === 0) return 0.0;
    let transpositions = 0;
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (!s1Matches[i]) continue;
      while (!s2Matches[k]) k++;
      if (s1[i] !== s2[k]) transpositions++;
      k++;
    }

    return (
      (matches / len1 +
        matches / len2 +
        (matches - transpositions / 2) / matches) /
      3
    );
  }

  const jaro = jaroSimilarity(s1, s2);
  let prefix = 0;
  for (let i = 0; i < Math.min(s1.length, s2.length, 4); i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }

  return (jaro + 0.1 * prefix * (1 - jaro)) * 100;
}

export async function matchPanAadhaarDob(dob1: string, dob2: string) {
  const normalize = (s: string) => {
    const parts = s.replace(/\//g, "-").split("-");
    if (parts[0].length === 4) {
      return parts.join("-");
    }
    return parts.reverse().join("-");
  };

  const d1 = new Date(normalize(dob1)).toISOString().slice(0, 10);
  const d2 = new Date(normalize(dob2)).toISOString().slice(0, 10);

  return d1 === d2;
}
