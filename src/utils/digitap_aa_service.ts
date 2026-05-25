import { ApiSupplierType } from "@/enums/common.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import LeadApiLogService from "@/services/lead_api_log.service";
import axios, { AxiosError, AxiosInstance } from "axios";
const leadApiLogService = new LeadApiLogService();

interface DigitapAAConfig {
  baseURL?: string;
  clientID: string;
  clientSecret: string;
  timeout?: number;
}

interface DigitapGenerateUrlPayload {
  customerID: number;
  leadID: number;
  mobile: string;
  returnUrl: string;
  callbackUrl: string;
  sessionExpire?: boolean;
}

export interface DigitapServiceResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
  error?: any;
}

interface DigitapTxnStatus {
  code: string;
  status: "Success" | "Failure" | "Error" | "InProgress";
  msg?: string;
  txn_id?: string;
}

export class DigitapAccountAggregatorService {
  private client: AxiosInstance;
  private clientID: string;
  private clientSecret: string;

  constructor(config: DigitapAAConfig) {
    this.clientID = config.clientID;
    this.clientSecret = config.clientSecret;

    this.client = axios.create({
      baseURL: config.baseURL || "https://svcdemo.digitap.work/bank-data",
      timeout: config.timeout || 60000,
    });
  }

  public async generateUrl(
    payload: DigitapGenerateUrlPayload,
  ): Promise<DigitapServiceResponse> {
    try {
      const requestBody = {
        client_ref_num: this.buildClientRefNum(
          payload.customerID,
          payload.leadID,
        ),
        txn_completed_cburl: payload.callbackUrl,
        destination: "accountaggregator",
        return_url: payload.returnUrl,
        mobile_num: payload.mobile,
        aa_fetch_type: "ONETIME",
      };
      console.log("===================>payload.returnUrl", payload.returnUrl);
      console.log(
        "===================>payload.callbackUrl",
        payload.callbackUrl,
      );
      const response = await this.client.post("/generateurl", requestBody, {
        headers: this.getHeaders(),
        validateStatus: () => true,
      });

      if (response.status !== 200 || response.data?.status !== "success") {
        return {
          status: false,
          message: response.data?.msg || "Unable to generate Digitap AA URL",
          data: response.data,
        };
      }

      const endpoint = "/generateurl";
      const fullURL = new URL(
        endpoint,
        this.client.defaults.baseURL,
      ).toString();
      console.log("FULL URL ===>", fullURL);

      const saveDigitapGenerateURLData: ILeadsApiLog = {
        customerID: payload.customerID,
        leadID: payload.leadID.toString(),
        api_type: LeadLogApiType.DIGITAP_AA_GENERATE_URL,
        api_supplier: ApiSupplierType.DIGITAP,
        api_endpoint_url: fullURL,
        api_method: "POST",
        status: 1,
        api_headers: JSON.stringify(this.getHeaders()),
        api_request: JSON.stringify(payload),
        api_response: JSON.stringify(response.data),
      };
      await leadApiLogService.create(saveDigitapGenerateURLData);

      return {
        status: true,
        message: "Digitap AA URL generated",
        data: {
          request_id: response.data.request_id,
          redirect_url: response.data.url,
          expires: response.data.expires,
          client_ref_num: requestBody.client_ref_num,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: "Digitap Generate URL failed",
        error: this.handleError(error),
      };
    }
  }

  public async statusCheck(
    requestId: string,
    payload: any,
  ): Promise<DigitapServiceResponse> {
    try {
      const response = await this.client.post(
        "/statuscheck",
        { request_id: requestId },
        {
          headers: this.getHeaders(),
          validateStatus: () => true,
        },
      );

      if (response.status !== 200 || response.data?.status !== "success") {
        return {
          status: false,
          message: response.data?.msg || "Digitap status check failed",
          data: response.data,
        };
      }

      const txnStatusList: DigitapTxnStatus[] = response.data.txn_status || [];

      const reportGeneratedTxn = txnStatusList.find(
        (item) => item.code === "ReportGenerated" && item.status === "Success",
      );

      if (!reportGeneratedTxn?.txn_id) {
        return {
          status: false,
          message: "Digitap report not ready",
          data: {
            request_id: requestId,
            retry: true,
            txn_status: txnStatusList,
          },
        };
      }

      const endpoint = "/statuscheck";
      const fullURL = new URL(
        endpoint,
        this.client.defaults.baseURL,
      ).toString();
      console.log("FULL URL ===>", fullURL);

      const saveDigitapStatusCheckData: ILeadsApiLog = {
        customerID: payload.customerID,
        leadID: payload.leadID.toString(),
        api_type: LeadLogApiType.DIGITAP_AA_STATUS_CHECK,
        api_supplier: ApiSupplierType.DIGITAP,
        api_endpoint_url: fullURL,
        api_method: "POST",
        status: 1,
        api_headers: JSON.stringify(this.getHeaders()),
        api_request: JSON.stringify(payload),
        api_response: JSON.stringify(response.data),
      };
      await leadApiLogService.create(saveDigitapStatusCheckData);

      return {
        status: true,
        message: "Digitap report generated",
        data: {
          request_id: requestId,
          txn_id: reportGeneratedTxn.txn_id,
          txn_status: txnStatusList,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: "Digitap Status Check failed",
        error: this.handleError(error),
      };
    }
  }

  public async retrieveReport(
    txnId: string,
    payload: any,
  ): Promise<DigitapServiceResponse> {
    try {
      const response = await this.client.post(
        "/retrievereport",
        {
          txn_id: txnId,
          report_type: "json",
          report_subtype: "type1",
        },
        {
          headers: this.getHeaders(),
          validateStatus: () => true,
        },
      );

      if (response.status !== 200 || response.data?.status === "error") {
        return {
          status: false,
          message:
            response.data?.message || "Unable to retrieve Digitap report",
          data: response.data,
        };
      }

      const endpoint = "/retrievereport";
      const fullURL = new URL(
        endpoint,
        this.client.defaults.baseURL,
      ).toString();
      console.log("FULL URL ===>", fullURL);

      const saveDigitapStatusCheckData: ILeadsApiLog = {
        customerID: payload.customerID,
        leadID: payload.leadID.toString(),
        api_type: LeadLogApiType.DIGITAP_AA_REPORT,
        api_supplier: ApiSupplierType.DIGITAP,
        api_endpoint_url: fullURL,
        api_method: "POST",
        status: 1,
        api_headers: JSON.stringify(this.getHeaders()),
        api_request: JSON.stringify(payload),
        api_response: JSON.stringify(response.data),
      };
      await leadApiLogService.create(saveDigitapStatusCheckData);

      return {
        status: true,
        message: "Digitap report fetched",
        data: response.data,
      };
    } catch (error) {
      return {
        status: false,
        message: "Digitap Retrieve Report failed",
        error: this.handleError(error),
      };
    }
  }

  private getHeaders() {
    const credentials = Buffer.from(
      `${this.clientID}:${this.clientSecret}`,
      "utf8",
    ).toString("base64");

    return {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    };
  }

  private buildClientRefNum(customerID: number, leadID: number): string {
    return `AA-${customerID}-${leadID}-${Date.now()}`;
  }

  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      };
    }

    return {
      message: error?.message || "Unknown error",
    };
  }
}
