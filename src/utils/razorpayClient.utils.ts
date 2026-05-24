// import Razorpay from 'razorpay';
import config from "@/config/default";
import { razorPayLogsModel } from "@/database/mysql/razorpay_logs";
import { razorpayMandateModel } from "@/database/mysql/razorpay_mandate";
import { razorpayMandateStatusModel } from "@/database/mysql/razorpay_mandate_status";
import { RazorPayApiUrl, RazorPayLogApiType } from "@/enums/razorpay.enum";
import {
  ICreateEmandateLink,
  IRazorPayEmandateWebhookPayload,
  IRazorpaySubscriptionRegistrationRequest,
  IRazorpaySubscriptionRegistrationResponse,
} from "@/interfaces/onboarding.interface";
import {
  IRazorPayCreateCustomerRequest,
  IRazorPayCreateCustomerResponse,
  IRazorPayCreateOrderRequest,
  IRazorPayCreateOrderResponse,
  IRazorPayFetchInvoice,
  IRazorPayPaymentsResponse,
} from "@/interfaces/razorpay.interface";
import {
  IRazorPayContactsRequest,
  IRazorPayContactsResponse,
  IRazorPayCreateFundAccountRequest,
  IRazorPayCreateFundAccountResponse,
  IRazorPayValidateAccountRequest,
  IRazorPayValidateAccountResponse,
  IRazorPayVerifyFundAccountByIdRequest,
  IRazorPayVerifyFundAccountByIdResponse,
} from "@/interfaces/razorpay_payout_accounts.interface";
import AxiosService from "@/services/api.service";
import RazorpayWebhookLogsService from "@/services/razorpaywebhooklogs";
import axios from "axios";
import moment from "moment";
import { logger } from "./logger";
import {
  convertRupeesToPaise,
  generateRandomNumber,
  truncateString,
} from "./util";

import { leadModel } from "@/database/mysql/leads";
import crypto from "crypto";
import short from "short-uuid";

import { lenderCredsModel } from "@/database/mysql/lender_creds";
import {
  LenderCredentials,
  LenderList,
  LenderStatus,
} from "@/enums/lender.enum";
import { createStepTrackerEntry } from "@/middlewares/stepCheck2.middleware";
import { leadService } from "@/services/lead.service";
import { getDecryptedObject } from "./AESEncryption";

class RazorpayPG {
  baseUrl = "https://api.razorpay.com/v1";
  private razorpayWebhookLogsService = new RazorpayWebhookLogsService();
  auth = Buffer.from(
    `${config.razorpayDisbursalKeyId}:${config.razorpayDisbursalKeySecret}`,
  ).toString("base64");

  private pennyAuth = Buffer.from(
    `${config.razorpayPennyKeyId}:${config.razorpayPennyKeySecret}`,
  ).toString("base64");

  subscriptionauth = Buffer.from(
    `${config.razorpayKey}:${config.razorpaySecret}`,
  ).toString("base64");

  nandanvanMandateRepaymentAuth = Buffer.from(
    `${config.razorpayDisbursalKeyIdNandanvan}:${config.razorpayDisbursalKeySecretNandanvan}`,
  ).toString("base64");

  private readonly apiService = new AxiosService(config.razorPayBaseUrl);
  private readonly razorPayLogsModel = razorPayLogsModel;
  private readonly razorpayMandateModel = razorpayMandateModel;
  private readonly razorpayMandateStatusModel = razorpayMandateStatusModel;
  private readonly leadModel = leadModel;
  private readonly lenderCredsModel = lenderCredsModel;

  get headers() {
    return {
      Authorization: `Basic ${this.auth}`,
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    };
  }
  get xHeaders() {
    return {
      Authorization: `Basic ${this.pennyAuth}`,
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    };
  }

  get nandanvanMandateRepaymentHeaders() {
    return {
      Authorization: `Basic ${this.nandanvanMandateRepaymentAuth}`,
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    };
  }

  public createOrder2 = async (requestBody: {}) => {
    try {
      let apiUrl = `${this.baseUrl}/orders/`;
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.auth}`,
        },
      });

      return response.data;
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(
          `Error creating order: ${error.response.status} ${error.response.statusText}`,
        );
        console.error("Error details:", error.response.data);
      }
      return error;
    }
  };

  public createRecurringPayment = async (requestBody: {}) => {
    try {
      let apiUrl = `${this.baseUrl}/payments/create/recurring/`;
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.auth}`,
        },
      });
      return response.data;
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(
          `Error creating order: ${error.response.status} ${error.response.statusText}`,
        );
        console.error("Error details:", error.response.data);
      }
      return error;
    }
  };

  public createPlan = async (requestBody: {}) => {
    try {
      let apiUrl = `${this.baseUrl}/plans/`;
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.auth}`,
        },
      });
      // console.log(response.data)
      return response.data;
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(
          `Error creating order: ${error.response.status} ${error.response.statusText}`,
        );
        console.error("Error details:", error.response.data);
      }
      return error;
    }
  };

  public createSubscription = async (requestBody: {}) => {
    try {
      let apiUrl = `${this.baseUrl}/subscriptions/`;
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.subscriptionauth}`,
        },
      });
      return response.data;
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(
          `Error creating order: ${error.response.status} ${error.response.statusText}`,
        );
        console.error("Error details:", error.response);
      }
      return error;
    }
  };

  public createNormalRefund = async (requestBody: {}, paymentId: string) => {
    try {
      let apiUrl = `${this.baseUrl}/payments/${paymentId}/refund`;
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.auth}`,
        },
      });
      return response;
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(
          `Error creating refund: ${error.response.status} ${error.response.statusText}`,
        );
        console.error("Error details:", error.response);
      }
      return error.response;
    }
  };

  createContact = async (
    customerID: number,
    leadID: number,
    payload: IRazorPayContactsRequest,
  ) => {
    const creds = await this.getLenderCredentialsByLeadId(
      leadID,
      LenderCredentials.RAZORPAY_PENNY,
    );
    const auth = Buffer.from(
      `${creds.razorpay_x_key_id}:${creds.razorpay_x_secret_key}`,
    ).toString("base64");

    const response = await this.apiService.call<
      IRazorPayContactsResponse,
      IRazorPayContactsRequest,
      undefined
    >("post", RazorPayApiUrl.CREATE_CONTACT, payload, undefined, {
      Authorization: `Basic ${auth}`,
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    });

    // save the response to razorpay logs
    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(payload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_CONTACT,
      type: RazorPayLogApiType.CONTACTS,
    });

    return response;
  };

  createFundAccount = async (
    customerID: number,
    leadID: number,
    payload: IRazorPayCreateFundAccountRequest,
  ) => {
    const creds = await this.getLenderCredentialsByLeadId(
      leadID,
      LenderCredentials.RAZORPAY_PENNY,
    );
    const auth = Buffer.from(
      `${creds.razorpay_x_key_id}:${creds.razorpay_x_secret_key}`,
    ).toString("base64");

    const response = await this.apiService.call<
      IRazorPayCreateFundAccountResponse,
      IRazorPayCreateFundAccountRequest,
      undefined
    >(
      "post",
      RazorPayApiUrl.CREATE_FUND_ACCOUNT,
      payload,
      undefined,
      // this.xHeaders,
      {
        Authorization: `Basic ${auth}`,
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    );

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(payload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_FUND_ACCOUNT,
      type: RazorPayLogApiType.FUND_ACCOUNTS,
    });

    return response;
  };

  validateAccount = async (
    customerID: number,
    leadID: number,
    payload: IRazorPayValidateAccountRequest,
  ) => {
    const creds = await this.getLenderCredentialsByLeadId(
      leadID,
      LenderCredentials.RAZORPAY_PENNY,
    );
    const auth = Buffer.from(
      `${creds.razorpay_x_key_id}:${creds.razorpay_x_secret_key}`,
    ).toString("base64");

    const response = await this.apiService.call<
      IRazorPayValidateAccountResponse,
      IRazorPayValidateAccountRequest,
      undefined
    >(
      "post",
      RazorPayApiUrl.VALIDATE_ACCOUNT,
      payload,
      undefined,
      // this.xHeaders,
      {
        Authorization: `Basic ${auth}`,
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    );

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(payload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.VALIDATE_ACCOUNT,
      type: RazorPayLogApiType.VALIDATE_ACCOUNT,
    });

    return response;
  };

  verifyFundTransaction = async (
    customerID: number,
    leadID: number,
    payload: IRazorPayVerifyFundAccountByIdRequest,
  ) => {
    const creds = await this.getLenderCredentialsByLeadId(
      leadID,
      LenderCredentials.RAZORPAY_PENNY,
    );
    const auth = Buffer.from(
      `${creds.razorpay_x_key_id}:${creds.razorpay_x_secret_key}`,
    ).toString("base64");

    const response = await this.apiService.call<
      IRazorPayVerifyFundAccountByIdResponse,
      IRazorPayVerifyFundAccountByIdRequest,
      undefined
    >(
      "get",
      RazorPayApiUrl.VALIDATE_ACCOUNT + `/${payload.p_id}`,
      undefined,
      undefined,
      {
        Authorization: `Basic ${auth}`,
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    );

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(payload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url:
        config.razorPayBaseUrl +
        RazorPayApiUrl.VALIDATE_ACCOUNT +
        `/${payload.p_id}`,
      type: RazorPayLogApiType.VERIFY_TRANSACTION,
    });

    return response;
  };

  public fetchDisbursedPayment = async (id: string) => {
    try {
      let apiUrl = `${this.baseUrl}/payouts/${id}`;
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.auth}`,
        },
      });
      return response;
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(
          `Error fetching dusbursal payment: ${error?.response?.data?.message}`,
        );
      }
      return error.response;
    }
  };

  createEmandateAuthLink = async (
    customerID: number,
    leadID: number,
    payload: ICreateEmandateLink,
  ) => {
    const { email, contact, accountNo, accountType, ifsc, amount } = payload;

    let { name } = payload;

    name = truncateString(name);

    const maxAmount = convertRupeesToPaise(amount * 3);
    const timestamp = Date.now(); // Returns the number of milliseconds since January 1, 1970

    // Convert timestamp to string and get the last two digits
    const lastTwoDigits = timestamp.toString().slice(-2);

    const notesData =
      name.substring(0, 20) +
      "-" +
      contact +
      "-" +
      generateRandomNumber(111, 9999) +
      lastTwoDigits;

    const apiPayload: IRazorpaySubscriptionRegistrationRequest = {
      customer: {
        contact,
        email,
        name,
      },
      amount: 0,
      currency: "INR",
      description: name,
      email_notify: 1,
      sms_notify: 1,
      expire_by: moment().add(24, "months").unix(),
      receipt: notesData,
      type: "link",
      subscription_registration: {
        auth_type: "",
        expire_at: moment().add(24, "months").unix(),
        max_amount: maxAmount,
        method: "emandate",
        bank_account: {
          account_number: accountNo,
          account_type: accountType.toLowerCase() + "s",
          beneficiary_name: name,
          ifsc_code: ifsc,
        },
      },
      notes: { note_key_1: notesData, note_key_2: notesData },
    };
    const response = await this.apiService.call<
      IRazorpaySubscriptionRegistrationResponse,
      IRazorpaySubscriptionRegistrationRequest,
      undefined
    >(
      "post",
      RazorPayApiUrl.CREATE_SUBSCRIPTION_LINK,
      apiPayload,
      undefined,
      this.headers,
    );

    // save the response to razorpay logs
    if (response.data.currency_symbol) delete response.data.currency_symbol;

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(apiPayload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_SUBSCRIPTION_LINK,
      type: RazorPayLogApiType.EMANDATE,
    });

    return response;
  };

  emandateAuthLinkWebhook = async (
    payload: IRazorPayEmandateWebhookPayload,
  ) => {
    if (payload.payload.payment.entity.notes?.disableWebhook) {
      logger.info("Webhook triggered invoice callback logic");
      // Write logic to handle the callback scenario, if invoice.paid was delayed

      const rpayMandate = await this.razorpayMandateModel.findOne({
        where: { order_id: payload.payload.payment.entity.order_id },
        select: [
          "customerID",
          "leadID",
          "id",
          "customer_id",
          "accountNo",
          "accountType",
          "bank",
          "ifsc",
        ],
      });

      if (!rpayMandate) {
        logger.error("Mandate details not found");
        return;
      }

      // No need to do insert entry if status already exists

      const rpayMandateStatus = await this.razorpayMandateStatusModel.findOne({
        where: {
          customer_id: rpayMandate.customer_id,
          inv_id: payload.payload.invoice.entity.id,
          leadID: rpayMandate.leadID,
          tokenID: payload.payload.payment.entity.token_id,
        },
        select: ["id"],
      });

      const promises = [];

      if (!rpayMandateStatus) {
        promises.push(
          this.razorpayMandateStatusModel.insert({
            customer_id: rpayMandate.customer_id,
            emId: String(rpayMandate.id),
            emstatus: payload.payload.invoice.entity.status,
            inv_id: payload.payload.invoice.entity.id,
            leadID: rpayMandate.leadID,
            tokenID: payload.payload.payment.entity.token_id,
            accountNo: rpayMandate.accountNo,
            accountType: rpayMandate.accountType,
            bank: rpayMandate.bank,
            ifsc: rpayMandate.ifsc,
          }),
        );
      }

      promises.push(
        this.razorpayMandateModel.findOneAndUpdate(
          {
            id: rpayMandate.id,
          },
          {
            inv_id: payload.payload.invoice.entity.id,
            invoice_number:
              payload.payload.invoice.entity.invoice_number ??
              rpayMandate.invoice_number,
            token_id: payload.payload.payment.entity.token_id,
            status: payload.payload.invoice.entity.status,
            short_url: payload.payload.invoice.entity.short_url,
          },
        ),
      );

      await Promise.all(promises);
      return;
    }

    const rpayMandate = await this.razorpayMandateModel.findOne({
      where: { order_id: payload.payload.payment.entity.order_id },
      select: [
        "id",
        "customer_id",
        "inv_id",
        "leadID",
        "accountNo",
        "accountType",
        "bank",
        "ifsc",
        "customerID",
      ],
    });

    if (!rpayMandate) {
      logger.error("Mandate details not found");
      return;
    }
    // Update Razorpay mandate status model
    // Update RazorPay Mandate Model

    await Promise.all([
      this.razorpayMandateStatusModel.insert({
        customer_id: rpayMandate.customer_id,
        emId: String(rpayMandate.id),
        emstatus: payload.payload.order.entity.status,
        inv_id: rpayMandate.inv_id,
        leadID: rpayMandate.leadID,
        tokenID: payload.payload.payment.entity.token_id,
        accountNo: rpayMandate.accountNo,
        accountType: rpayMandate.accountType,
        bank: rpayMandate.bank,
        ifsc: rpayMandate.ifsc,
      }),
      this.razorpayMandateModel.findOneAndUpdate(
        {
          id: rpayMandate.id,
        },
        {
          status: payload.payload.order.entity.status,
          token_id: payload.payload.payment.entity.token_id,
        },
      ),
    ]);

    const leadData = await leadService.findOne({
      leadID: Number(rpayMandate.leadID),
      customerID: Number(rpayMandate.customerID),
    });

    if (
      payload.payload.invoice.entity.status === "paid" ||
      payload.payload.invoice.entity.status === "issued"
    ) {
      createStepTrackerEntry(
        Number(rpayMandate.customerID),
        Number(rpayMandate.leadID),
        leadData.fbLeads === "Repeat Case"
          ? Number(config.repeat_emandate)
          : Number(config.new_emandate),
      );
    }
  };

  createPaymentLink = async (requestBody: {}) => {
    try {
      const apiUrl = `${this.baseUrl}/payment_links`; // Razorpay Payment Link API URL

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.subscriptionauth}`, // Basic Authentication
        },
      });

      return response.data; // Return the payment link data
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(
          `Error creating payment link: ${error.response.status} ${error.response.statusText}`,
        );
        console.error("Error details:", error.response.data);
      }
      return error;
    }
  };
  // New emandate flow
  createCustomer = async (
    customerID: number,
    leadID: number,
    payload: IRazorPayCreateCustomerRequest,
    lenderID: number,
  ) => {
    const { contact, email, fail_existing, notes } = payload;
    let { name } = payload;

    name = truncateString(name);

    const notesData =
      name.substring(0, 20) + "-" + contact + "-" + short.generate();

    const apiPayload: IRazorPayCreateCustomerRequest = {
      contact,
      email,
      fail_existing: fail_existing ?? "0",
      name,
      notes: notes ?? { note_key_1: notesData, note_key_2: notesData },
    };
    const creds = {
      razorpay_disbursal_key_id:
        lenderID == LenderList.NADANAVAN
          ? config.razorpayDisbursalKeyIdNandanvan
          : config.razorpayDisbursalKeyId,
      razorpay_disbursal_secret_key:
        lenderID == LenderList.NADANAVAN
          ? config.razorpayDisbursalKeySecretNandanvan
          : config.razorpayDisbursalKeySecret,
    };
    const auth = Buffer.from(
      `${creds.razorpay_disbursal_key_id}:${creds.razorpay_disbursal_secret_key}`,
    ).toString("base64");

    const response = await this.apiService.call<
      IRazorPayCreateCustomerResponse,
      IRazorPayCreateCustomerRequest,
      undefined
    >(
      "post",
      RazorPayApiUrl.CREATE_CUSTOMER,
      apiPayload,
      undefined,
      // this.headers,
      {
        Authorization: `Basic ${auth}`,
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    );

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(apiPayload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_CUSTOMER,
      type: RazorPayLogApiType.CREATE_CUSTOMER,
    });

    return response;
  };

  createOrder = async (
    customerID: number,
    leadID: number,
    payload: IRazorPayCreateOrderRequest,
    lenderID: number,
  ) => {
    const {
      amount,
      currency,
      customer_id,
      method,
      payment_capture,
      receipt,
      token,
    } = payload;

    let { notes } = payload;

    const notesData = customerID + "-" + short.generate() + "-" + leadID;

    notes = notes ?? {
      note_key_1: notesData,
    };

    const apiPayload: IRazorPayCreateOrderRequest = {
      amount,
      currency,
      customer_id,
      payment_capture: typeof payment_capture === "undefined" ? true : false,
      method,
      notes,
      receipt: receipt ?? notesData,
    };

    if (token) {
      apiPayload.token = token;
    }
    const creds = {
      razorpay_disbursal_key_id:
        lenderID == LenderList.NADANAVAN
          ? config.razorpayDisbursalKeyIdNandanvan
          : config.razorpayDisbursalKeyId,
      razorpay_disbursal_secret_key:
        lenderID == LenderList.NADANAVAN
          ? config.razorpayDisbursalKeySecretNandanvan
          : config.razorpayDisbursalKeySecret,
    };
    const auth = Buffer.from(
      `${creds.razorpay_disbursal_key_id}:${creds.razorpay_disbursal_secret_key}`,
    ).toString("base64");

    const response = await this.apiService.call<
      IRazorPayCreateOrderResponse,
      IRazorPayCreateOrderRequest,
      undefined
    >("post", RazorPayApiUrl.CREATE_ORDER, apiPayload, undefined, {
      Authorization: `Basic ${auth}`,
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    });

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(apiPayload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_ORDER,
      type: RazorPayLogApiType.CREATE_ORDER,
    });

    return response;
  };

  fetchPayment = async (
    customerID: number,
    leadID: number,
    paymentId: string,
  ) => {
    // ! Basically fetch token, 3rd step of emandate
    // This will hit after frontend hit callbackurl

    const creds = await this.getLenderCredentialsByLeadId(
      leadID,
      LenderCredentials.RAZORPAY_EMANDATE,
    );

    const auth = Buffer.from(
      `${creds.razorpay_disbursal_key_id}:${creds.razorpay_disbursal_secret_key}`,
    ).toString("base64");

    const response = await this.apiService.call<
      IRazorPayPaymentsResponse,
      undefined,
      undefined
    >("get", `${RazorPayApiUrl.PAYMENTS}/${paymentId}`, undefined, undefined, {
      Authorization: `Basic ${auth}`,
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    });

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify({ paymentId }),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url:
        creds.razorpay_base_url + `${RazorPayApiUrl.PAYMENTS}/${paymentId}`,
      type: RazorPayLogApiType.PAYMENTS,
    });

    return response;
  };

  fetchInvoice = async (
    customerID: number,
    leadID: number,
    invoiceId: string,
  ) => {
    const response = await this.apiService.call<
      IRazorPayFetchInvoice,
      undefined,
      undefined
    >(
      "get",
      `${RazorPayApiUrl.INVOICES}/${invoiceId}`,
      undefined,
      undefined,
      this.headers,
    );

    delete response.data.currency_symbol;

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify({ invoiceId }),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url:
        config.razorPayBaseUrl + `${RazorPayApiUrl.INVOICES}/${invoiceId}`,
      type: RazorPayLogApiType.INVOICES,
    });

    return response;
  };

  verifySignature(orderId: string, paymentId: string, signature: string) {
    // Generate the expected signature using the order_id and payment_id
    const hmac = crypto.createHmac("sha256", config.razorpayDisbursalKeySecret);
    hmac.update(orderId + "|" + paymentId);

    const generatedSignature = hmac.digest("hex");

    return generatedSignature === signature;
  }

  private async getLenderCredentialsByLeadId(
    leadId: number,
    keyType: LenderCredentials,
  ): Promise<any> {
    const leadRecord = await this.leadModel.findOne({
      where: { leadID: leadId },
      select: ["lenderID"],
    });

    if (!leadRecord) {
      throw new Error(`Lead not found with ID: ${leadId}`);
    }

    const lenderRecord = await this.lenderCredsModel.findOne({
      where: {
        lenderID: leadRecord.lenderID,
        cred_name: keyType,
        status: LenderStatus.ACTIVE,
      },
      select: ["credentials"],
    });

    if (!lenderRecord?.credentials) {
      throw new Error(
        `Lender credentials not found with ID: ${leadRecord.lenderID}`,
      );
    }

    const decrytedCredentials = getDecryptedObject(lenderRecord.credentials);

    return decrytedCredentials;
  }
}

export default RazorpayPG;

export const razorPayPayments = new RazorpayPG();
