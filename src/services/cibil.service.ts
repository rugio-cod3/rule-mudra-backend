import config from "@/config/default";
import { CreditReportConstants } from "@/constants/creditReport.constants";
import RazorpaySubscriptionModel from "@/database/mysql/razorpay_subscription";
import { PaymentCheckoutStatus } from "@/enums/cibil.enum";
import { BadRequestError, InternalServerError, NotFoundError } from "@/errors";
import CommonHelper from "@/helpers/common";
import {
  IAccountDetailsPayload,
  IAnswerQuestionPayload,
  ICreateCheckoutPayload,
  IExperianPullPayload,
  IfecthOrderDetailsPayload,
  IGetJourneyStep,
  IGetPaymentStatusPayload,
  IGetSubscriptionPayload,
  IGetSubscriptionPayments,
  IGetSubscriptionProcess,
  IGetTermsAndConditionsPayload,
  IPaymentCheckoutPayload,
  IReportSummaryPayload,
  IUpdateJourneysPayload,
  IViewImpactPayload,
} from "@/interfaces/cibil.interface";
import {
  CreditReportServiceReqParams,
  CreditReportVerifyAuthAnsReqParams,
  CustomerInfoReqParam,
  VerifyAuthAnsReqParam,
} from "@/interfaces/cibilReport.interface";
import { ICustomer } from "@/interfaces/customer.interface";
import { IRazorPayCreateSubscription } from "@/interfaces/razorpay_subscription.interface";
import { serviceResponse } from "@/interfaces/service.interface";
import { ISubscriptionPayment } from "@/interfaces/subscription_payments.interface";
import SubscriptionPaymentModel from "@/mysql/subscription_payments";
import { termsAndConditions } from "@/staticdata/cibilscoret&c";
import { generateSHA1Hash, generateUniqueId } from "@/utils/dbEncrypt";
import { logger } from "@/utils/logger";
import { getKnexInstance } from "@/utils/mysql";
import RazorpayPG from "@/utils/razorpayClient.utils";
import axios from "axios";
import fs from "fs";
import https from "https";
import { performance } from "perf_hooks";
import { cwd } from "process";
import CreditScoreUserJourneyService from "./credit_socore_user_journey.service";
import CustomerService from "./customer.service";
import {
  experianPull,
  getQuestionExperian,
  postAnswerOfExperian,
} from "./php.service";
import RazorpaySubscriptionService from "./razorpay_subscription.service";
import ResponseService from "./response.service";
import SubscriptionPaymentService from "./subscription_payments.service";
import TransectionService from "./teansections.services";
import UserSummaryService from "./user_summary.service";

const { crStatus } = CreditReportConstants;

export default class CibilApiUtils extends ResponseService {
  private creditScoreUserJourneyService = new CreditScoreUserJourneyService();
  private customerService = new CustomerService();
  private razorpaySubscriptionService = new RazorpaySubscriptionService();
  private razorpayInstance = new RazorpayPG();
  private subscriptionPaymentService = new SubscriptionPaymentService();
  private userSummaryService = new UserSummaryService();
  private transactionService = new TransectionService();
  private commonHelper = new CommonHelper();
  private subscriptionPaymentModel = new SubscriptionPaymentModel();
  private razorpaySubscription = new RazorpaySubscriptionModel();

  get Knex() {
    let db = getKnexInstance();
    return db;
  }

  private baseUrl = config.cibilCredentials.apiBase;
  private headers = {
    "member-ref-id": config.cibilCredentials.custRefId,
    apikey: config.cibilCredentials.apiKey,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Construct the absolute paths to the certificate and key files
  private httpsAgent = new https.Agent({
    cert: fs.readFileSync(`${cwd()}${config.cibilCredentials.cert}`, {
      encoding: "utf8",
    }),
    passphrase: config.cibilCredentials.passphrase,
    key: fs.readFileSync(`${cwd()}${config.cibilCredentials.key}`, {
      encoding: "utf8",
    }),
    rejectUnauthorized: false,
  });

  private api = axios.create({
    httpsAgent: this.httpsAgent,
    headers: this.headers,
  });

  private getCommonRequestParams(shakey: string) {
    return {
      SiteName: config.cibilCredentials.siteName,
      AccountName: config.cibilCredentials.accountName,
      AccountCode: config.cibilCredentials.accountCode,
      ClientKey: shakey,
      RequestKey: generateUniqueId(),
      PartnerCustomerId: shakey,
    };
  }

  public async fulfillOffer(
    customerInfo: CustomerInfoReqParam,
    shakey: string,
  ): Promise<serviceResponse> {
    let respObj: serviceResponse;
    let updateData = {};
    let startTime = performance.now();
    try {
      const apiUrl = this.baseUrl + "/fulfilloffer";
      // https://apiuat.cibilhawk.com/consumer/dtc/v4/fulfilloffer
      const apiReqParams = {
        FulfillOfferRequest: {
          ...this.getCommonRequestParams(shakey),
          ProductConfigurationId:
            config.cibilCredentials.productConfigurationId,
          CustomerInfo: customerInfo,
          LegalCopyStatus: "Accept",
          UserConsentForDataSharing: true,
        },
      };

      let startTime = performance.now();
      console.log("apiReqParams ==========>>>>>>>>>", apiReqParams);
      const response = await this.api.post(apiUrl, apiReqParams);
      console.log("response======>>>>>>>", response);
      console.log(
        "failure error",
        response?.data?.FulfillOfferResponse?.FulfillOfferError,
      );
      // if (
      //   response?.data?.FulfillOfferResponse?.FulfillOfferError.Failure
      //     .FailureEnum === 'NO_HIT'
      // ) {
      //   respObj = {
      //     ok: false,
      //     err:'error in cibil',
      //     data: response?.data?.FulfillOfferResponse?.FulfillOfferError,
      //   };
      //   return respObj;
      // }

      let endTime = performance.now();
      let responseTime = endTime - startTime;

      updateData = {
        response_time: responseTime,
        response_params: response?.data,
        response_status: response?.status || null,
      };

      const fulfillOfferResp = response?.data?.FulfillOfferResponse;

      if (fulfillOfferResp?.FulfillOfferSuccess) {
        respObj = {
          ok: true,
          data: fulfillOfferResp.FulfillOfferSuccess,
        };
      } else {
        respObj = {
          ok: false,
          err: fulfillOfferResp?.FulfillOfferError?.Failure,
        };
        respObj.err = JSON.stringify(respObj.err);
      }
    } catch (error) {
      logger.error(error);
      console.log("error on fulfilloffer", error);

      let endTime = performance.now();
      let responseTime = endTime - startTime;

      updateData = {
        response_time: responseTime,
        response_params: error || "INVALID",
        response_status: error?.response?.status || null,
      };

      respObj = {
        ok: false,
        err: "Something Went Wrong",
      };
    }
    return respObj;
  }

  public async getCustomerAssets(
    shakey: string,
    userId: number,
  ): Promise<serviceResponse> {
    let respObj: serviceResponse;
    let updateData = {};
    let startTime = performance.now();

    try {
      const apiUrl = this.baseUrl + "/GetCustomerAssets";

      const apiReqParams = {
        GetCustomerAssetsRequest: {
          ...this.getCommonRequestParams(shakey),
          LegalCopyStatus: "Accept",
        },
      };
      console.log("customerAssets ======= >>>>>>>>>>>>>>>", apiReqParams);
      const response = await this.api.post(apiUrl, apiReqParams);
      console.log("response customer assets===========>>>>>>>>>", response);
      console.log(
        response?.data?.GetCustomerAssetsResponse?.GetCustomerAssetsSuccess,
      );

      let endTime = performance.now();
      let responseTime = endTime - startTime;
      updateData = {
        response_time: responseTime,
        response_params: {
          ResponseStatus:
            response?.data?.GetCustomerAssetsResponse?.ResponseStatus || null,
          ResponseKey:
            response?.data?.GetCustomerAssetsResponse?.ResponseKey || null,
        },
        response_status: response?.status || null,
      };
      const customerAssetsResp = response?.data?.GetCustomerAssetsResponse;
      if (customerAssetsResp?.GetCustomerAssetsSuccess) {
        respObj = {
          ok: true,
          data: customerAssetsResp.GetCustomerAssetsSuccess,
        };
      } else {
        respObj = {
          ok: false,
          err: customerAssetsResp?.GetCustomerAssetsError?.Failure,
        };
        respObj.err = JSON.stringify(respObj);
      }
    } catch (error) {
      logger.error(error);

      let endTime = performance.now();
      let responseTime = endTime - startTime;

      updateData = {
        response_time: responseTime,
        response_params: error || "INVALID",
        response_status: error?.response?.status || null,
      };

      respObj = {
        ok: false,
        err: "Something Went Wrong",
      };
    }
    return respObj;
  }

  public async getAuthenticationQuestions(
    shakey: string,
    userId: number,
  ): Promise<serviceResponse> {
    let respObj: serviceResponse;
    let updateData = {};
    let startTime = performance.now();

    try {
      const apiUrl = this.baseUrl + "/GetAuthenticationQuestions";

      const apiReqParams = {
        GetAuthenticationQuestionsRequest: this.getCommonRequestParams(shakey),
      };

      let startTime = performance.now();
      console.log("apiReqParams in authQ=====>>>>", apiReqParams);
      const response = await this.api.post(apiUrl, apiReqParams);
      console.log("response at Quest====>>>>>>>", response);
      console.log(
        response?.data?.GetAuthenticationQuestionsResponse
          ?.GetAuthenticationQuestionsSuccess,
      );

      let endTime = performance.now();
      let responseTime = endTime - startTime;
      updateData = {
        response_time: responseTime,
        response_params: response?.data,
        response_status: response?.status || null,
      };

      const authQueResp = response?.data?.GetAuthenticationQuestionsResponse;

      if (authQueResp?.GetAuthenticationQuestionsSuccess) {
        respObj = {
          ok: true,
          data: authQueResp.GetAuthenticationQuestionsSuccess,
        };
      } else {
        respObj = {
          ok: false,
          err: authQueResp?.GetAuthenticationQuestionsError?.Failure,
        };
        respObj.err = JSON.stringify(respObj);
      }
    } catch (error) {
      logger.error(error);

      let endTime = performance.now();
      let responseTime = endTime - startTime;

      updateData = {
        response_time: responseTime,
        response_params: error || "INVALID",
        response_status: error?.response?.status || null,
      };

      respObj = {
        ok: false,
        err: "Something Went Wrong",
      };
    }
    return respObj;
  }

  public async verifyAuthenticationAnswers(
    answerParams: VerifyAuthAnsReqParam,
    shakey: string,
    userId: number,
  ): Promise<serviceResponse> {
    let respObj: serviceResponse;
    let updateData = {};
    let startTime = performance.now();

    try {
      const apiUrl = this.baseUrl + "/VerifyAuthenticationAnswers";

      const apiReqParams = {
        VerifyAuthenticationAnswersRequest: {
          ...this.getCommonRequestParams(shakey),
          ...answerParams,
        },
      };

      let startTime = performance.now();
      console.log("verifyAuthAnswrs=====>>>>>>>>>>>>", apiReqParams);
      const response = await this.api.post(apiUrl, apiReqParams);
      console.log("response of verifyAuthAnswers", response);
      let endTime = performance.now();
      let responseTime = endTime - startTime;
      updateData = {
        response_time: responseTime,
        response_params: response?.data,
        response_status: response?.status || null,
      };

      const authAnsResp = response?.data?.VerifyAuthenticationAnswersResponse;

      if (authAnsResp?.VerifyAuthenticationAnswersSuccess) {
        respObj = {
          ok: true,
          data: authAnsResp.VerifyAuthenticationAnswersSuccess,
        };
      } else {
        respObj = {
          ok: false,
          err: authAnsResp?.VerifyAuthenticationAnswersError?.Failure,
        };
        respObj.err = JSON.stringify(respObj);
      }
    } catch (error) {
      logger.error(error);

      let endTime = performance.now();
      let responseTime = endTime - startTime;

      updateData = {
        response_time: responseTime,
        response_params: error || "INVALID",
        response_status: error?.response?.status || null,
      };

      respObj = {
        ok: false,
        err: "Something Went Wrong",
      };
    }
    return respObj;
  }

  public async verifyAuthAnswers(
    requestBody: CreditReportVerifyAuthAnsReqParams,
  ): Promise<serviceResponse> {
    const { userId, answer } = requestBody;
    const userProfile = (await this.customerService.findOne(
      { customerID: userId },
      ["customerID", "pancard", "mobile"],
    )) as ICustomer;
    if (!userProfile) {
      return {
        ok: false,
        err: "Customer not found",
      };
    }
    // const pan = userProfile.pancard
    // const mobile = userProfile.mobile.toString()
    const pan = "VCFPI5822P";
    const mobile = config.appMode == 4 ? "9899964219" : "9399442128";
    // const pan = 'COLPD1370S'
    // const mobile = '9399442127'
    const shakey = generateSHA1Hash(`${pan}:${mobile.slice(-4)}`);

    const authVerificationResp = await this.verifyAuthenticationAnswers(
      answer,
      shakey,
      userId,
    );
    if (!authVerificationResp?.ok) return authVerificationResp;

    logger.info(
      `/credit-report/verify-auth authVerificationResp from cibil: ${authVerificationResp}`,
    );
    let fulfillOfferRespStatus = authVerificationResp.data?.IVStatus;
    let status: number =
      fulfillOfferRespStatus == "Success" ? crStatus.valid : crStatus.invalid;
    let securityCheck = true;
    if (
      securityCheck &&
      (fulfillOfferRespStatus == "InProgress" ||
        fulfillOfferRespStatus == "Pending")
    ) {
      status = crStatus.requestWIP;
    }
    if (status == crStatus.requestWIP) {
      const getAuthQueResp = await this.getAuthenticationQuestions(
        shakey,
        userId,
      );
      if (!getAuthQueResp.ok) return getAuthQueResp;
      return {
        ok: true,
        data: {
          ...getAuthQueResp.data,
          creditReportStatus: authVerificationResp.data?.IVStatus,
        },
      };
    }

    if (status == crStatus.valid) {
      return {
        ok: true,
        data: {
          creditReportStatus: authVerificationResp.data?.IVStatus,
        },
      };
    }

    return {
      ok: false,
      err: "INVALID",
      data: {
        key: "credit_report_error",
      },
    };
  }

  public async getProductWebToken(
    shakey: string,
    userId: number,
  ): Promise<serviceResponse> {
    let respObj: serviceResponse;
    let updateData = {};
    let startTime = performance.now();

    try {
      const apiUrl = this.baseUrl + "/GetProductWebToken";

      const apiReqParams = {
        GetProductWebTokenRequest: this.getCommonRequestParams(shakey),
      };

      let startTime = performance.now();
      const response = await this.api.post(apiUrl, apiReqParams);
      let endTime = performance.now();
      let responseTime = endTime - startTime;
      updateData = {
        response_time: responseTime,
        response_params: response?.data,
        response_status: response?.status || null,
      };

      const webTokenResp = response?.data?.GetProductWebTokenResponse;

      if (webTokenResp?.GetProductWebTokenSuccess) {
        respObj = {
          ok: true,
          data: webTokenResp.GetProductWebTokenSuccess,
        };
      } else {
        respObj = {
          ok: false,
          err: webTokenResp?.GetProductWebTokenError?.Failure,
        };
        respObj.err = JSON.stringify(respObj);
      }
    } catch (error) {
      logger.error(error);

      let endTime = performance.now();
      let responseTime = endTime - startTime;

      updateData = {
        response_time: responseTime,
        response_params: error || "INVALID",
        response_status: error?.response?.status || null,
      };

      respObj = {
        ok: false,
        err: "Something Went Wrong",
      };
    }
    return respObj;
  }

  public async getCreditViewLink(
    requestBody: CreditReportServiceReqParams,
  ): Promise<serviceResponse> {
    const { userId } = requestBody;
    const userProfile = (await this.customerService.findOne(
      { customerID: userId },
      ["customerID", "pancard", "mobile"],
    )) as ICustomer;
    if (!userProfile) {
      return {
        ok: false,
        err: "Customer not found",
      };
    }
    // const pan = userProfile.pancard
    // const mobile = userProfile.mobile.toString()
    const pan = "VCFPI5822P";
    const mobile = config.appMode == 4 ? "9899964219" : "9399442128";
    // const pan = 'COLPD1370S'
    // const mobile = '9399442127'
    const shakey = generateSHA1Hash(`${pan}:${mobile.slice(-4)}`);

    const webTokenResp = await this.getProductWebToken(shakey, userId);
    if (!webTokenResp?.ok) return webTokenResp;

    const link = `${config.cibilCredentials.creditViewUrl}?enterprise=${config.cibilCredentials.siteName}&pcc=${webTokenResp.data?.PartnerCustomerId}&webtoken=${webTokenResp.data?.WebToken}`;
    return {
      ok: true,
      data: {
        redirectionLink: link,
      },
    };
  }

  // New Code
  async getTermsAndConditions(payload: IGetTermsAndConditionsPayload) {
    const { customerID } = payload;

    let customer = await this.customerService.findOne({ customerID }, [
      "customerID",
    ]);
    if (!customer) throw new NotFoundError("Customer not found");

    let journeyDoc = await this.creditScoreUserJourneyService.findOne(
      { customerID },
      ["*"],
    );
    let checked: boolean;
    if (journeyDoc) {
      journeyDoc.step > 1 ? (checked = true) : false;
    } else {
      //create fresh journey
      await this.creditScoreUserJourneyService.create(1, customerID);
      checked = false;
    }

    return this.serviceResponse(
      200,
      { termsAndConditions, checked },
      "Terms and Condition",
    );
  }

  // New Code
  async updateJourneys(payload: IUpdateJourneysPayload) {
    const { step, customerID } = payload;
    // const experianStop = true;
    // if (experianStop === true) {
    //   throw new BadRequestError('Currently, this service is under maintenance')
    // }
    let customer = await this.customerService.findOne({ customerID }, [
      "customerID",
      "mobile",
    ]);
    if (!customer) throw new NotFoundError("Customer not found");
    const db = getKnexInstance();
    const result = await db("customer as c")
      .select("c.*", "a.*")
      .join("address as a", "c.customerID", "a.customerID")
      .where("c.mobile", customer.mobile)
      .orderBy("a.addressID", "desc")
      .first();
    if (!result) {
      throw new NotFoundError("Complete your kyc first then access your cibil");
    }
    let activeSubscription = await this.razorpaySubscriptionService.findOne(
      {
        customerID,
        status: PaymentCheckoutStatus.ACTIVE,
      },
      ["status"],
      [{ column: "id", order: "desc" }],
    );
    //why create logic here bcz t&c remove from flow
    let subscription: string;
    if (!activeSubscription) {
      await this.creditScoreUserJourneyService.create(1, customerID);
      await this.creditScoreUserJourneyService.updateOne(
        { customerID },
        { step: step },
      );
      subscription = "false";
    } else {
      subscription = "true";
    }
    return this.serviceResponse(
      200,
      { isActive: subscription },
      "Journey updated",
    );
  }

  // New Code
  async createCheckout(payload: ICreateCheckoutPayload) {
    let { customerID, name, email, mobile } = payload;

    let customer = await this.customerService.findOne({ customerID }, [
      "customerID",
    ]);
    if (!customer) throw new NotFoundError("Customer Not Found");

    let activeSubscription = await this.razorpaySubscriptionService.findOne(
      {
        customerID,
        status: PaymentCheckoutStatus.ACTIVE,
      },
      ["status"],
      [{ column: "id", order: "desc" }],
    );

    if (activeSubscription)
      throw new BadRequestError("You already have an Active Subscription");

    // let plan = await this.razorpayInstance.createPlan({
    //   period: "monthly",
    //   interval: 1,
    //   item: {
    //     name: "Credit Score Subscription",
    //     amount: 5900,
    //     currency: "INR",
    //     description: "Credit Score Subscription"
    //   },
    //   notes: {
    //     notes_key_1: "Tea, Earl Grey, Hot",
    //     notes_key_2: "Tea, Earl Grey… decaf."
    //   }
    // })
    // console.log(plan)
    // return
    let start = new Date(Date.now());
    start.setMonth(start.getMonth() + 1);
    start.setDate(8);
    let start_at = +Math.floor(start.getTime() / 1000);
    let subscription = await this.razorpayInstance.createSubscription({
      plan_id: config.razorpaySubscriptionPlanId,
      customer_notify: 1,
      quantity: 1,
      total_count: config.subscriptionCount,
      start_at,
      addons: [
        {
          item: {
            name: "Subscription Activation Charge",
            amount: (config.subscriptionAmount + config.subscriptionGst) * 100,
            currency: "INR",
          },
        },
      ],
      notes: {
        customerID: customerID,
      },
    });
    let end = new Date(start);
    end.setMonth(end.getMonth() + config.subscriptionCount);

    const createSubscription: IRazorPayCreateSubscription = {
      customerID,
      startAt: start,
      endAt: end,
      status: PaymentCheckoutStatus.INITIATED,
      productID: 3,
      razorpay_response: JSON.stringify(subscription),
      razorpay_subscription_id: subscription.id,
    };
    await this.razorpaySubscriptionService.create(createSubscription);

    await this.creditScoreUserJourneyService.updateOne(
      { customerID },
      { step: 3 },
    );
    let baseUrl = this.commonHelper.getBaseUrl();
    const paymentLink = await this.razorpayInstance.createPaymentLink({
      amount: (config.subscriptionAmount + config.subscriptionGst) * 100, // Amount in paise
      currency: "INR",
      accept_partial: false,
      reference_id: subscription.id,
      description: "Subscription Activation Charge",
      customer: {
        name: name,
        email: email,
        contact: mobile.toString(),
      },
      notify: {
        sms: true,
        email: true,
      },
      callback_url: `${baseUrl}/app/success`,
      callback_method: "get",
    });
    return this.serviceResponse(
      200,
      {
        paymentLink: paymentLink.short_url,
        id: subscription?.id,
        key: config.razorpayKey,
        name,
        email,
        mobile,
        amount: (config.subscriptionAmount + config.subscriptionGst) * 100,
        successRedirectionUrl: `${baseUrl}/app/success`,
        failedRedirectionUrl: `${baseUrl}/app/failScreen`,
        logoUrl: "",
      },
      "Subscription Checkout",
    );
  }

  // New Code
  async getPaymentStatus(payload: IGetPaymentStatusPayload) {
    const { subscriptionid: subscriptionId } = payload;

    let payment = await this.subscriptionPaymentService.findOne(
      { subscriptionId: +subscriptionId },
      ["status"],
    );
    let status: string;
    if (payment) {
      payment.status == "success"
        ? (status = "success")
        : payment.status == "created"
        ? (status = "pending")
        : status == "failed";
    } else {
      let subscription = await this.razorpaySubscriptionService.findOne(
        { id: +subscriptionId },
        ["status"],
      );

      if (subscription && subscription.status == "initiated") {
        status = "pending";
      } else {
        status = "failed";
      }
    }

    return this.serviceResponse(200, { status }, "Payment Status");
  }

  // New Code
  async experianPull(payload: IExperianPullPayload) {
    const { token, customerId, name } = payload;
    let subscription = await this.razorpaySubscriptionService.findOne(
      { customerID: customerId, status: PaymentCheckoutStatus.ACTIVE },
      ["status", "createdAt", "razorpay_subscription_id"],
      [{ column: "id", order: "desc" }],
    );
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Months are 0-based, so add 1
    let db = getKnexInstance();
    // let db = getKnexInstance()
    // const today = new Date()
    // const currentYear = today.getFullYear()
    // const currentMonth = today.getMonth() + 1
    // const creditReport = (await db('credit_reports')
    //   .where({ customerID: req.customer.customerID })
    //   .andWhere(function () {
    //     this.whereRaw('YEAR(created_at) != ?', [currentYear]).orWhereRaw(
    //       'MONTH(created_at) != ?',
    //       [currentMonth],
    //     )
    //   })) as ISubscriptionPayment[]
    //let subscription = { status: 'active', createdAt: '2024-06-08 06:32:54' }
    if (subscription && subscription.status == "active") {
      const currentDate = new Date();
      const subscriptionDate = new Date(subscription.createdAt);

      const isSameMonthAndYear =
        subscriptionDate.getMonth() === currentDate.getMonth() &&
        subscriptionDate.getFullYear() === currentDate.getFullYear();

      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      );
      const endOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
      );
      endOfMonth.setHours(23);
      endOfMonth.setMinutes(59);
      endOfMonth.setSeconds(59);
      endOfMonth.setMilliseconds(999);

      let currentMonthUserSummary = await this.userSummaryService.findOne(
        {
          customerID: customerId,
          api_type: "report",
          Status: 1,
        },
        ["*"],
        [{ column: "id", order: "desc" }],
        { start: startOfMonth, end: endOfMonth },
      );
      const paymentOfThisMonth = (await db("subscription_payments")
        .where({
          status: "success",
          subscriptionId: subscription.razorpay_subscription_id,
        })
        .andWhere(function () {
          this.whereRaw("MONTH(createdAt) = ?", [currentMonth]);
        })
        .orderBy("id", "desc")) as ISubscriptionPayment[];

      if (!currentMonthUserSummary && paymentOfThisMonth) {
        let response = await experianPull(token, customerId, name);
        //console.log('yyyyy', response)

        if (response.status === 1 && response.message === "Success") {
          if (
            response.data?.errorString &&
            response.data.stageOneId_ &&
            response.data.stageTwoId_
          ) {
            // If there's an error or additional information required
            let resp = await getQuestionExperian(
              token,
              response.data.stageOneId_,
              response.data.stageTwoId_,
            );
            // remove console when q/a flow test
            if (resp.success) {
              console.log("Success data:", resp.data);
            } else {
              if (resp.data && resp.data.errors) {
                console.log("Errors:", resp.data.errors);
              } else {
                console.log("No errors field in response.");
              }
            }
            if (resp?.data?.questionToCustomer?.question) {
              return this.serviceResponse(
                200,
                {
                  type: resp.data.questionToCustomer.type,
                  qid: resp.data.questionToCustomer.qid,
                  question: resp.data.questionToCustomer.question,
                  optionsSet1: resp.data.questionToCustomer.optionsSet1,
                  optionsSet2: resp.data.questionToCustomer.optionsSet2,
                  stgOneHitId: resp.data.stgOneHitId,
                  stgTwoHitId: resp.data.stgTwoHitId,
                },
                "Question",
              );
            } else {
              throw new BadRequestError(
                "Problem In Your Details: Contact Support",
              );
            }
          } else if (response.data) {
            // console.log("entry in else")
            // If the data is successfully retrieved
            let userSummary = await this.userSummaryService.findOne(
              { customerID: customerId, api_type: "report", Status: 1 },
              ["*"],
              [{ column: "id", order: "desc" }],
            );
            //let parsedJsonValue = userSummary?.json_value ? JSON.parse(userSummary.json_value) : {};
            let data: object;
            if (userSummary?.json_value) {
              if (typeof userSummary.json_value === "string") {
                data = JSON.parse(userSummary.json_value);
              } else {
                data = userSummary.json_value;
              }
            } else {
              data = {};
            }

            return this.serviceResponse(200, data, "Credit Report");
          }
        }
      } else {
        // If data for the same month is already present in the DB
        let userSummary = await this.userSummaryService.findOne(
          { customerID: customerId, api_type: "report", Status: 1 },
          ["*"],
          [{ column: "id", order: "desc" }],
        );
        // let parsedJsonValue = userSummary?.json_value ? JSON.parse(userSummary.json_value) : {};
        let data: object;
        if (userSummary?.json_value) {
          if (typeof userSummary.json_value === "string") {
            data = JSON.parse(userSummary.json_value);
          } else {
            data = userSummary.json_value;
          }
        } else {
          data = {};
        }

        if (userSummary) {
          return this.serviceResponse(200, data, "Credit Report");
        } else {
          throw new NotFoundError("No Credit report found");
        }
      }
    } else {
      throw new NotFoundError("You Have No Active Subscription");
    }
  }

  // New Code
  async answerQuestions(payload: IAnswerQuestionPayload) {
    let {
      stgOneHitId,
      stgTwoHitId,
      questionId,
      answer1,
      answer2,
      access_token,
      customerId,
    } = payload;

    let response = await postAnswerOfExperian(
      access_token,
      stgOneHitId,
      stgTwoHitId,
      questionId,
      answer1,
      answer2,
    );
    if (response.status == 1 && response.message == "Success") {
      if (response?.data?.questionToCustomer?.question) {
        return this.serviceResponse(
          200,
          {
            type: response?.data?.questionToCustomer?.type,
            qid: response?.data?.questionToCustomer?.qid,
            question: response?.data?.questionToCustomer?.question,
            optionsSet1: response?.data?.questionToCustomer?.optionsSet1,
            optionsSet2: response?.data?.questionToCustomer?.optionsSet2,
            stgOneHitId: response?.data?.stgOneHitId,
            stgTwoHitId: response?.data?.stgTwoHitId,
          },
          "Question",
        );
      } else if (
        response?.data?.responseJson == "inCorrectAnswersGiven" &&
        response?.data?.showHtmlReportForCreditReport == null
      ) {
        throw new BadRequestError("Incorrect Answers");
      } else {
        //change this else to elseif and put condition when all answers are correct and credit score is pulled
        let userSummary = await this.userSummaryService.findOne(
          { customerID: customerId, api_type: "report", Status: 1 },
          ["*"],
          [{ column: "id", order: "desc" }],
        );
        // let parsedJsonValue = userSummary?.json_value ? JSON.parse(userSummary.json_value) : {};
        let data: object;
        if (userSummary?.json_value) {
          if (typeof userSummary.json_value === "string") {
            data = JSON.parse(userSummary.json_value);
          } else {
            data = userSummary.json_value;
          }
        } else {
          data = {};
        }

        if (userSummary) {
          return this.serviceResponse(200, data, "Credit Report");
        }
      }
    } else {
      throw new InternalServerError("Something Went Wrong In Submit Amswer");
    }
  }

  // New Code
  async paymentCheckout(payload: IPaymentCheckoutPayload) {
    const { customerID } = payload;

    let subscription = await this.razorpaySubscriptionService.findOne(
      { customerID },
      ["status", "id"],
    );
    if (!subscription) throw new NotFoundError("Subscription not found");

    switch (subscription.status) {
      case PaymentCheckoutStatus.ACTIVE:
        throw new BadRequestError("Can't Pay For Already Active Subscription'");

      case PaymentCheckoutStatus.INACTIVE:
        let order = await this.razorpayInstance.createOrder2({
          amount: (config.subscriptionAmount + config.subscriptionGst) * 100,
          currency: "INR",
          notes: {
            subscriptionid: subscription.id,
          },
        });
        return this.serviceResponse(200, order, "Checkout");
      case PaymentCheckoutStatus.CANCELLED:
        throw new BadRequestError(
          "Canceled Subscription: Cant Re-Activate Please Go For Fresh Process",
        );

      case PaymentCheckoutStatus.INITIATED:
        throw new BadRequestError(
          "You Just Initiated The Subscription And Left",
        );
      default:
        throw new BadRequestError("Invalid payment status");
    }
  }

  // New Code
  async updateSubscriptionPayment(payload: any) {
    const { requestBody } = payload;

    let paymentinfo = requestBody.payload?.payment?.entity;

    if (!paymentinfo)
      throw new NotFoundError("Did Not find payload payment entity");

    if (paymentinfo.status == PaymentCheckoutStatus.CAPTURED) {
      let subscription = await this.razorpaySubscriptionService.findOne(
        {
          id: paymentinfo?.notes[0]?.subscriptionid,
        },
        ["*"],
      );
      if (!subscription) throw new NotFoundError("Subscription Not Found");

      let customer = await this.customerService.findOne(
        { customerID: subscription.customerID },
        ["*"],
      );
      if (!customer) throw new NotFoundError("Customer not found");

      await this.subscriptionPaymentService.create(
        subscription.customerID,
        subscription.id,
        paymentinfo.order_id,
        paymentinfo.id,
        config.subscriptionAmount,
        config.subscriptionGst,
        paymentinfo.amount / 100,
        paymentinfo.status == PaymentCheckoutStatus.CAPTURED
          ? PaymentCheckoutStatus.SUCCESS
          : paymentinfo.status,
        JSON.stringify(requestBody),
      );
      await this.transactionService.create(
        subscription.customerID,
        0,
        "",
        100,
        "subscriptionChargedManual",
        paymentinfo.method,
        paymentinfo.id,
        paymentinfo.order_id,
        0,
        "razorpay",
        1,
        1,
        paymentinfo.amount / 100,
      );
      await this.razorpaySubscriptionService.updateOne(
        { id: subscription.id },
        { status: "active" },
      );
      console.log("3. Changed Successfully:-", requestBody.event);
      return this.serviceResponse(200, {}, "Payment Captured");
    }
  }

  // New Code
  async getJourneyStep(payload: IGetJourneyStep) {
    const { customerID } = payload;
    let customer = await this.customerService.findOne({ customerID }, [
      "customerID",
    ]);
    if (!customer) throw new BadRequestError("Incorrect Customer Id");

    console.log(customerID);
    let journeyDoc = await this.creditScoreUserJourneyService.findOne(
      { customerID },
      ["step"],
    );
    if (!journeyDoc)
      throw new BadRequestError("This Customer Not Even Try Required Journey");

    return this.serviceResponse(
      200,
      { step: journeyDoc.step },
      "Here Is The Step",
    );
  }

  // New Code
  async getSubscription(payload: IGetSubscriptionPayload) {
    const { status, subscriptionID, customerID, sort, skip, take } = payload;

    let result = await this.razorpaySubscriptionService.findByFilter(
      {
        status,
        id: subscriptionID,
        customerID,
      },
      { orderKey: "startAt", orderValue: sort },
      ["*"],
      skip,
      take,
    );

    return this.serviceResponse(200, { result }, "Subscriptions");
  }

  // New Code
  async getSubscriptionPayments(payload: IGetSubscriptionPayments) {
    const {
      status,
      subscriptionId,
      customerID,
      id,
      orderId,
      paymentId,
      skip,
      take,
      sort,
    } = payload;

    let result = await this.subscriptionPaymentService.findByFilter(
      {
        status,
        subscriptionId,
        customerID,
        id,
        orderId,
        paymentId,
      },
      { orderKey: "createdAt", orderValue: sort },
      ["*"],
      skip,
      take,
    );

    return this.serviceResponse(200, { result }, "Subscriptions");
  }

  // New Code
  async getSubscriptionProcess(payload: IGetSubscriptionProcess) {
    const { customerID, id, step, skip, take, sortOn, sort } = payload;

    let result = await this.creditScoreUserJourneyService.findByFilter(
      {
        step,
        customerID,
        id,
      },
      { orderKey: sortOn, orderValue: sort },
      ["*"],
      skip,
      take,
    );
    return this.serviceResponse(200, { result }, "Subscriptions");
  }
  async reportSummary(payload: IReportSummaryPayload) {
    const { customerID, provider } = payload;

    let reportSummary = await this.userSummaryService.findOne(
      { Status: 1, api_type: "report", customerID: customerID },
      ["json_value"],
      [{ column: "id", order: "desc" }],
    );

    if (
      reportSummary &&
      reportSummary.json_value &&
      reportSummary.json_value[provider]
    ) {
      let providerData =
        typeof reportSummary.json_value === "string"
          ? JSON.parse(reportSummary.json_value)
          : reportSummary.json_value;
      return this.serviceResponse(200, providerData, "Credit Report");
    } else {
      return this.serviceResponse(200, {}, "No data found");
    }
  }

  async accountDetails(payload: IAccountDetailsPayload) {
    const { customerID, accountId } = payload;

    let accountDetails = await this.userSummaryService.findOne(
      { Status: 1, api_type: "account", customerID: customerID },
      ["json_value"],
      [{ column: "id", order: "desc" }],
    );
    if (
      accountDetails &&
      accountDetails.json_value &&
      accountDetails.json_value[accountId]
    ) {
      let accountData =
        typeof accountDetails.json_value[accountId] === "string"
          ? JSON.parse(accountDetails.json_value[accountId])
          : accountDetails.json_value[accountId];
      return this.serviceResponse(200, accountData, "AccountDetails");
    } else {
      return this.serviceResponse(200, {}, "No data found");
    }
  }

  async viewImpactDetails(payload: IViewImpactPayload) {
    const { customerID, impactId } = payload;

    let viewImpactDetails = await this.userSummaryService.findOne(
      { Status: 1, api_type: "view", customerID: customerID },
      ["json_value"],
      [{ column: "id", order: "desc" }],
    );
    if (
      viewImpactDetails &&
      viewImpactDetails.json_value &&
      viewImpactDetails.json_value[impactId]
    ) {
      let viewImpact =
        typeof viewImpactDetails.json_value[impactId] === "string"
          ? JSON.parse(viewImpactDetails.json_value[impactId])
          : viewImpactDetails.json_value[impactId];
      return this.serviceResponse(200, viewImpact, "viewImpactDetails");
    } else {
      return this.serviceResponse(200, {}, "No data found");
    }
  }
  async fetchRazorpayOrder(payload: IfecthOrderDetailsPayload) {
    const { customerId } = payload;
    let db = getKnexInstance();

    const currentDate = new Date().toISOString().split("T")[0];

    const orderResult = await db("subscription_payments")
      .select("orderId", "status")
      .where("customerID", customerId)
      .andWhere(db.raw("DATE(createdAt) = ?", [currentDate]))
      .orderBy("createdAt", "desc")
      .first();

    if (!orderResult) {
      return this.serviceResponse(404, {}, "Order not found for the customer");
    }

    const { orderId } = orderResult;

    const apiUrl = `${this.razorpayInstance.baseUrl}/orders/${orderId}`;

    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.razorpayInstance.subscriptionauth}`,
      },
    });
    let baseUrl = this.commonHelper.getBaseUrl();
    let redirect_url: string;
    if (response.data.status === "paid") {
      redirect_url = `${baseUrl}/app/success`;
    } else {
      redirect_url = `${baseUrl}/app/failScreen`;
    }
    const data = {
      razorpayData: response.data,
      url: redirect_url,
    };
    return this.serviceResponse(200, data, "Order fetched successfully");
  }

  async cancelExperianSubscription() {
    let db = getKnexInstance();
    const currentDate = new Date().toISOString().split("T")[0];

    const subscriptionData = await this.razorpaySubscription.find({
      whereIn: [
        {
          column: "status",
          value: ["active", "initiated"],
        },
      ],
      select: ["customerID", "razorpay_subscription_id"],
      order: [{ column: "id", order: "desc" }],
    });

    if (subscriptionData.length === 0) {
      throw new NotFoundError("No Active subscription found");
    }
    const customerIDs = subscriptionData.map((sub) => sub.customerID);
    const customerMap = new Map(
      (
        await db("customer")
          .select("customerID", "email")
          .whereIn("customerID", customerIDs)
      ).map((c) => [c.customerID, c.email]),
    );
    const authString = `${config.razorpayKey}:${config.razorpaySecret}`;
    const encodedAuth = Buffer.from(authString).toString("base64");

    await Promise.allSettled(
      subscriptionData.map(async ({ customerID, razorpay_subscription_id }) => {
        try {
          const email = customerMap.get(customerID);
          if (!email) {
            console.warn(`Customer email not found for ID: ${customerID}`);
            return;
          }
          const apiUrl = `${this.razorpayInstance.baseUrl}/subscriptions/${razorpay_subscription_id}/cancel`;

          const response = await axios.post(
            apiUrl,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${encodedAuth}`,
              },
            },
          );

          if (response.data.status === "cancelled") {
            await this.razorpaySubscriptionService.updateOne(
              { razorpay_subscription_id },
              {
                status: PaymentCheckoutStatus.CANCELLED,
                cancelled_date: currentDate,
              },
            );
          } else {
            console.log(
              `Subscription ${razorpay_subscription_id} is not cancelled yet.`,
            );
            return;
          }
          const mailData = {
            from: config.mail_for_ses,
            to: email,
            subject:
              "Important Update: Discontinuation of Experian Bureau Pull",
            body: `
              <p>Dear Customer,</p>
              <p>We hope this message finds you well.</p>
          
              <p>We are writing to inform you that, as part of ongoing updates to our services, the <strong>Experian Bureau pull feature</strong> will no longer be available for customers. This change will take effect immediately. We apologize for any inconvenience this may cause and want to ensure that this transition is as smooth as possible for you.</p>
          
              <p>Additionally, any active mandates linked to <strong>Razorpay</strong> will be canceled, effective <strong>${currentDate}</strong>. If you have any ongoing transactions or subscriptions linked to this service, please take the necessary steps to update your payment methods.</p>                    
          
              <p>Thank you for your understanding, and we appreciate your continued support.</p>
          
              <p>Best regards,</p>
              <p><strong>Team Ram Fincorp</strong></p>
            `,
          };

          await this.commonHelper.sendMailSwitcher(mailData);
          console.log(`Email sent to ${email}`);
        } catch (error) {
          console.error(
            `Error processing customerID ${customerID}:`,
            error.message,
          );
        }
      }),
    );

    return this.serviceResponse(
      200,
      {},
      "Subscription cancellation process completed",
    );
  }
}
