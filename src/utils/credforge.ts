import { ApiSupplierType } from "@/enums/common.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import LeadApiLogService from "@/services/lead_api_log.service";
import axios, { AxiosError, AxiosInstance } from "axios";

const leadApiLogService = new LeadApiLogService();

/**
 * =========================================================
 * CONFIG
 * =========================================================
 */

interface CredForgeBreConfig {
  baseURL?: string;
  clientID: string;
  apiKey: string;
  timeout?: number;
}

/**
 * =========================================================
 * COMMON TYPES
 * =========================================================
 */

export enum CredForgeBreDecision {
  APPROVE = "Approve",
  REJECT = "Reject",
  PROCEED_TO_BANK = "Proceed to Bank",
  PTB = "PTB",
}

export enum BureauType {
  CRIF = "crif_hardpull",
  CIBIL = "cibil",
  EXPERIAN = "experian",
  EQUIFAX = "equifax",
}

export enum BankType {
  BANK_AA = "bank_aa",
  BANK_BSA = "bank_bsa",
}

/**
 * =========================================================
 * BUREAU BRE PAYLOAD
 * =========================================================
 */

export interface BureauBrePayload {
  userId: string;
  referenceId: string;
  leadId: string;
  appUserId?: string;
  declaredIncome: number;
  bureauType: BureauType | string;
  rawBureauData: unknown;
}

/**
 * =========================================================
 * BANK BRE PAYLOAD
 * =========================================================
 */

export interface BankMetadata {
  currency?: string;
  bank_name?: string;
  ifsc_code?: string;
  account_type?: string;
  employer_name?: string;
  account_number?: string;
  account_holder_name?: string;
  statement_fetch_date?: string;
  statement_start_date?: string;
  statement_end_date?: string;
}

export interface BankTransaction {
  [key: string]: unknown;
}

export interface BankAccountData {
  metadata: BankMetadata;
  transaction_data: BankTransaction[];
}

export interface BankBrePayload {
  userId: string;
  referenceId: string;
  leadId: string;
  declaredIncome: number;
  bankType: BankType | string;
  bankData: BankAccountData | BankAccountData[];
}

/**
 * =========================================================
 * COMMON RESPONSE
 * =========================================================
 */

export interface CredForgeBreResponse {
  success: boolean;
  requestPayload?: unknown;
  response?: any;
  decision?: string;
  offerAmount?: number | null;
  error?: any;
}

/**
 * =========================================================
 * CRED FORGE BRE SERVICE
 * =========================================================
 */

export class CredForgeBreService {
  private client: AxiosInstance;
  private clientID: string;
  private apiKey: string;

  constructor(config: CredForgeBreConfig) {
    this.clientID = process.env.CREDU_CLIENT_ID!;
    this.apiKey = process.env.CREDU_API_KEY!;

    this.client = axios.create({
      baseURL: config.baseURL || "https://credforge.credeau.com/api",
      timeout: config.timeout || 60000,
    });
  }

  /**
   * =========================================================
   * PUBLIC METHOD: BUREAU BRE
   * =========================================================
   */

  public async executeBureauBre(
    payload: BureauBrePayload,
  ): Promise<CredForgeBreResponse> {
    try {
      const requestPayload = await this.buildBureauBrePayload(payload);
      const response = await this.client.post(
        `/execute/${this.clientID}/bureau_mobile_bre`,
        requestPayload,
        {
          headers: this.getHeaders(),
          validateStatus: () => true,
        },
      );
      if (response.status < 200 || response.status >= 300) {
        throw {
          message: "CredForge Bureau BRE API failed",
          status: response.status,
          data: response.data,
        };
      }
      console.log(
        "================================>BRE PAYLOAD",
        requestPayload,
      );
      const endpoint = `/execute/${this.clientID}/bureau_mobile_bre`;
      const fullURL = new URL(
        endpoint,
        this.client.defaults.baseURL,
      ).toString();
      console.log("FULL URL ===>", fullURL);

      const saveCrifAuthorizedData: ILeadsApiLog = {
        customerID: Number(payload.userId),
        leadID: payload.leadId,
        api_type: LeadLogApiType.BUREAU_BRE,
        api_supplier: ApiSupplierType.CREDFORGE,
        api_endpoint_url: fullURL,
        api_method: "POST",
        status: 1,
        api_headers: JSON.stringify(this.getHeaders()),
        api_request: JSON.stringify(requestPayload),
        api_response: JSON.stringify(response.data),
      };
      await leadApiLogService.create(saveCrifAuthorizedData);

      return {
        success: true,
        requestPayload,
        response: response.data,
        decision: this.extractDecision(response.data),
        offerAmount: this.extractOfferAmount(response.data),
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * =========================================================
   * PUBLIC METHOD: BANK BRE
   * =========================================================
   */

  public async executeBankBre(
    payload: BankBrePayload,
  ): Promise<CredForgeBreResponse> {
    try {
      const requestPayload = this.buildBankBrePayload(payload);

      const response = await this.client.post(
        `/execute/${this.clientID}/bank_bre`,
        requestPayload,
        {
          headers: this.getHeaders(),
          validateStatus: () => true,
        },
      );

      if (response.status < 200 || response.status >= 300) {
        throw {
          message: "CredForge Bank BRE API failed",
          status: response.status,
          data: response.data,
        };
      }

      const endpoint = `/execute/${this.clientID}/bank_bre`;
      const fullURL = new URL(
        endpoint,
        this.client.defaults.baseURL,
      ).toString();
      console.log("FULL URL ===>", fullURL);

      const saveCrifAuthorizedData: ILeadsApiLog = {
        customerID: Number(payload.userId),
        leadID: payload.leadId,
        api_type: LeadLogApiType.BANK_BRE,
        api_supplier: ApiSupplierType.CREDFORGE,
        api_endpoint_url: fullURL,
        api_method: "POST",
        status: 1,
        api_headers: JSON.stringify(this.getHeaders()),
        api_request: JSON.stringify(payload),
        api_response: JSON.stringify(response.data),
      };
      await leadApiLogService.create(saveCrifAuthorizedData);

      return {
        success: true,
        requestPayload,
        response: response.data,
        decision: this.extractDecision(response.data),
        offerAmount: this.extractOfferAmount(response.data),
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * =========================================================
   * BUILD BUREAU BRE REQUEST
   * =========================================================
   */

  private buildBureauBrePayload(payload: BureauBrePayload) {
    return {
      user_id: payload.userId,
      reference_id: payload.referenceId,
      input_data: {
        lead_id: payload.leadId,
        app_user_id: payload.appUserId || payload.userId,
        declared_income: payload.declaredIncome,
        external: {
          bureau_type: payload.bureauType,
          bureau_raw_json: this.encodeBase64(
            (payload.rawBureauData as any)?.bureauResponse,
          ),
        },
      },
    };
  }

  /**
   * =========================================================
   * BUILD BANK BRE REQUEST
   * =========================================================
   */

  private buildBankBrePayload(payload: BankBrePayload) {
    return {
      user_id: payload.userId,
      reference_id: payload.referenceId,
      input_data: {
        lead_id: payload.leadId,
        declared_income: payload.declaredIncome,
        external: {
          bank_type: payload.bankType,
          bank_data: payload.bankData,
        },
      },
    };
  }

  /**
   * =========================================================
   * HEADERS
   * =========================================================
   */

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-client-id": this.clientID,
      "x-auth-token": this.apiKey,
    };
  }

  /**
   * =========================================================
   * BASE64 ENCODER
   * =========================================================
   */

  private encodeBase64(data: unknown): string {
    const rawString = typeof data === "string" ? data : JSON.stringify(data);

    return Buffer.from(rawString, "utf8").toString("base64");
  }

  /**
   * =========================================================
   * DECISION EXTRACTOR
   * =========================================================
   */

  private extractDecision(data: any): string | undefined {
    return (
      data?.output_data?.rules_output?.final_decision?.Decision ||
      data?.output_data?.rules_output?.final_decision?.decision ||
      data?.final_decision?.Decision ||
      data?.final_decision?.decision
    );
  }

  /**
   * =========================================================
   * OFFER AMOUNT EXTRACTOR
   * =========================================================
   */

  private extractOfferAmount(data: any): number | null {
    const amount =
      data?.output_data?.rules_output?.final_decision?.LoanAmount ||
      data?.output_data?.rules_output?.final_decision?.loan_amount ||
      data?.final_decision?.LoanAmount ||
      data?.final_decision?.loan_amount;

    if (amount === undefined || amount === null || amount === "") {
      return null;
    }

    return Number(amount);
  }

  /**
   * =========================================================
   * ERROR HANDLER
   * =========================================================
   */

  private handleError(error: any): any {
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
      status: error?.status,
      data: error?.data,
    };
  }
}
