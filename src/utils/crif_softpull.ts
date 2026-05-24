// crifSoftPull.service.ts

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import { XMLParser } from "fast-xml-parser";

/**
 * =========================================================
 * CONFIG
 * =========================================================
 */

interface CrifConfig {
  baseURL?: string;
  appID: string;
  merchantID: string;
  username: string;
  secretKey: string;
  productCode?: string;
  timeout?: number;
}

/**
 * =========================================================
 * CUSTOMER DATA
 * =========================================================
 */

export interface CustomerData {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  mobile: string;
  email?: string;
  pan?: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country?: string;
}

/**
 * =========================================================
 * STAGE 1 RESPONSE
 * =========================================================
 */

interface InitiateResponse {
  redirectURL: string;
  reportId: string;
  orderId: string;
  status: string;
}

/**
 * =========================================================
 * FINAL RESPONSE
 * =========================================================
 */

export interface CrifSoftPullResponse {
  success: boolean;
  orderId?: string;
  reportId?: string;
  initiateResponse?: any;
  authorizationResponse?: any;
  bureauResponse?: any;
  error?: any;
}

/**
 * =========================================================
 * CRIF SERVICE
 * =========================================================
 */

export class CrifSoftPullService {
  private client: AxiosInstance;
  private appID: string;
  private merchantID: string;
  private username: string;
  private secretKey: string;
  private productCode: string;
  private xmlParser: XMLParser;

  constructor(config: CrifConfig) {
    this.appID = config.appID;
    this.merchantID = config.merchantID;
    this.username = config.username;
    this.secretKey = config.secretKey;
    this.productCode = config.productCode || "BBC CONSUMER SCORE#2.0";
    this.client = axios.create({
      baseURL:
        config.baseURL ||
        "https://test.crifhighmark.com/Inquiry/do.getSecureService",

      timeout: config.timeout || 30000,
    });

    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
  }

  /**
   * =========================================================
   * MAIN PUBLIC METHOD
   * =========================================================
   */

  async softPull(customerData: CustomerData): Promise<CrifSoftPullResponse> {
    try {
      /**
       * STAGE 1
       */
      const initiateResponse = await this.initiate(customerData);

      /**
       * VALIDATION
       */
      if (!initiateResponse?.reportId || !initiateResponse?.orderId) {
        throw new Error("Invalid Stage 1 response from CRIF");
      }

      /**
       * STAGE 2
       */
      const authorizationResponse = await this.authorize(initiateResponse);
      console.log(
        "================>authorizationResponse",
        authorizationResponse,
      );
      /**
       * OPTIONAL VALIDATION
       */
      if (!authorizationResponse?.reportId && !authorizationResponse.orderId) {
        throw new Error(
          `Authorization failed with status: ${authorizationResponse.status}`,
        );
      }

      /**
       * STAGE 3
       */
      const bureauResponse = await this.fetchReport(initiateResponse);
      console.log("bureauResponse=============>", bureauResponse);
      return {
        success: true,
        orderId: initiateResponse.orderId,
        reportId: initiateResponse.reportId,
        initiateResponse,
        authorizationResponse,
        bureauResponse,
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
   * STAGE 1
   * =========================================================
   */

  /* private async initiate(
    customerData: CustomerData,
  ): Promise<InitiateResponse> {
    const orderId = this.generateOrderId();
    const payload = this.buildStage1Payload(customerData);
    // const headers = this.getHeaders({
    //   orderId,
    //   "Content-Type": "text/plain",
    // });

    // console.log("============== CRIF REQUEST ==============");
    // console.log("URL:");
    // console.log(`${this.client.defaults.baseURL}/DTC/initiate`);

    // console.log("\nHEADERS:");
    // console.log(JSON.stringify(headers, null, 2));

    // console.log("\nPAYLOAD:");
    // console.log(payload);

    // console.log("==========================================");
    // const response = await this.client.post("/DTC/initiate", payload, {
    //   headers: this.getHeaders({
    //     orderId,
    //     "Content-Type": "text/plain",
    //   }),
    // });

    const response = await axios({
      method: "POST",
      url: "https://test.crifhighmark.com/Inquiry/do.getSecureService/DTC/initiate",
      headers: {
        orderId,
        merchantID: this.merchantID,
        accessCode: this.generateAccessCode(),
        appID: this.appID,
        "Content-Type": "text/plain",
      },
      data: payload,
    });
    console.log("================>RESPONSE", response);
    return response.data;
  } */

  private async initiate(
    customerData: CustomerData,
  ): Promise<InitiateResponse> {
    const orderId = this.generateOrderId();

    const accessCode = this.generateAccessCode(); // generate once only

    const payload = this.buildStage1Payload(customerData);

    console.log("CRIF ORDER ID:", orderId);
    console.log("CRIF ACCESS CODE:", accessCode);
    console.log("CRIF PAYLOAD:", payload);

    const response = await axios.post(
      "https://test.crifhighmark.com/Inquiry/do.getSecureService/DTC/initiate",
      payload,
      {
        headers: {
          orderId: orderId,
          accessCode: accessCode,
          appID: this.appID,
          merchantID: this.merchantID,
          "Content-Type": "text/plain",
        },
        transformRequest: [(data) => data],
        timeout: 60000,
        validateStatus: () => true,
      },
    );

    console.log("CRIF STATUS:", response.status);
    console.log("CRIF DATA:", response.data);

    return response.data;
  }

  /**
   * =========================================================
   * STAGE 2
   * =========================================================
   */

  private async authorize(data: InitiateResponse): Promise<any> {
    const payload = this.buildStage23Payload(data);

    const response = await this.client.post("/DTC/response", payload, {
      headers: this.getHeaders({
        orderId: data.orderId,
        reportId: data.reportId,
        requestType: "Authorization",
        Accept: "application/xml",
        "Content-Type": "application/xml",
      }),
    });

    return this.parseResponse(response.data);
  }

  /**
   * =========================================================
   * STAGE 3
   * =========================================================
   */

  private async fetchReport(data: InitiateResponse): Promise<any> {
    const payload = this.buildStage23Payload(data);
    const response = await this.client.post("/DTC/response", payload, {
      headers: this.getHeaders({
        orderId: data.orderId,
        reportId: data.reportId,
        Accept: "application/xml",
        "Content-Type": "application/xml",
      }),
    });

    return this.parseResponse(response.data);
  }

  /**
   * =========================================================
   * COMMON HEADERS
   * =========================================================
   */

  private getHeaders(
    extraHeaders: Record<string, any> = {},
  ): AxiosRequestConfig["headers"] {
    return {
      accessCode: this.generateAccessCode(),
      appID: this.appID,
      merchantId: this.merchantID,
      ...extraHeaders,
    };
  }

  /**
   * =========================================================
   * ACCESS CODE GENERATOR
   * =========================================================
   */

  private generateAccessCode(): string {
    const timestamp = this.getFormattedDate();

    const raw = [
      this.username,
      this.merchantID,
      this.productCode,
      this.secretKey,
      timestamp,
    ].join("|");

    return Buffer.from(raw, "utf8").toString("base64");
  }

  /**
   * =========================================================
   * STAGE 1 PAYLOAD
   * =========================================================
   */

  private buildStage1Payload(data: CustomerData): string {
    const fields = [
      data.firstName || "",
      data.middleName || "",
      data.lastName || "",
      "",
      data.dob || "",
      "",
      "",
      data.mobile || "",
      "",
      "",
      data.email || "",
      "",
      data.pan || "",

      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "", // 10 empty fields only

      data.address || "",
      data.city || "",
      data.district || "",
      data.state || "",
      data.pincode || "",
      data.country || "india",

      "",
      "",
      "",
      "",
      "",
      "",

      this.merchantID,
      "BBC_CONSUMER_SCORE#85#2.0",
      "Y",
      "",
    ];

    return fields.join("|");
  }

  /**
   * =========================================================
   * STAGE 2 + 3 PAYLOAD
   * =========================================================
   */

  private buildStage23Payload(data: InitiateResponse): string {
    return [
      data.orderId,
      data.reportId,
      this.generateAccessCode(),
      data.redirectURL,
      "N",
      "N",
      "Y",
    ].join("|");
  }

  /**
   * =========================================================
   * DATE FORMAT
   * =========================================================
   */

  private getFormattedDate(): string {
    const now = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    );
    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * =========================================================
   * ORDER ID
   * =========================================================
   */

  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORDER_${timestamp}_${random}`;
  }

  /**
   * =========================================================
   * XML / JSON RESPONSE PARSER
   * =========================================================
   */

  private parseResponse(data: any): any {
    if (!data) {
      return data;
    }

    /**
     * Already JSON
     */
    if (typeof data === "object") {
      /**
       * Replace B2C-REPORT with CIR-REPORT-FILE
       */
      if (data["B2C-REPORT"]) {
        data["CIR-REPORT-FILE"] = data["B2C-REPORT"];
        delete data["B2C-REPORT"];
      }

      return data;
    }

    /**
     * XML
     */
    if (typeof data === "string" && data.trim().startsWith("<")) {
      const parsedData = this.xmlParser.parse(data);

      /**
       * Replace B2C-REPORT with CIR-REPORT-FILE
       */
      if (parsedData["B2C-REPORT"]) {
        parsedData["CIR-REPORT-FILE"] = parsedData["B2C-REPORT"];
        delete parsedData["B2C-REPORT"];
      }

      return parsedData;
    }

    /**
     * JSON String
     */
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
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
    };
  }
}
