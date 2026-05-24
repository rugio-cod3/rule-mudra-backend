import config from "@/config/default";
import { PaymentCheckoutStatus } from "@/enums/cibil.enum";
import CommonHelper from "@/helpers/common";
import { IAddress } from "@/interfaces/address.interface";
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
import { CustomerInfoReqParam } from "@/interfaces/cibilReport.interface";
import { TSelectCreditScoreUserJourney } from "@/interfaces/credit_socore_user_journey.interface";
import { ICustomer } from "@/interfaces/customer.interface";
import { ICustomResponse } from "@/interfaces/response.interface";
import { serviceResponse } from "@/interfaces/service.interface";
import AddressService from "@/services/address.service";
import CibilApiUtils from "@/services/cibil.service";
import CreditScoreUserJourneyService from "@/services/credit_socore_user_journey.service";
import CustomerService from "@/services/customer.service";
import LeadApiLogService from "@/services/lead_api_log.service";
import RazorpayWebhookLogsService from "@/services/razorpaywebhooklogs";
import RazorpaySubscriptionService from "@/services/razorpay_subscription.service";
import ResponseService from "@/services/response.service";
import SubscriptionPaymentService from "@/services/subscription_payments.service";
import TransectionService from "@/services/teansections.services";
import UserSummaryService from "@/services/user_summary.service";
import { generateSHA1Hash } from "@/utils/dbEncrypt";
import { logger } from "@/utils/logger";
import RazorpayPG from "@/utils/razorpayClient.utils";
import { NextFunction, Request, Response } from "express";
import moment from "moment-timezone";

export interface IAuthenticatedRequest extends Request {
  customer: ICustomer;
}

class CibilScoreController extends ResponseService {
  private commonHelper = new CommonHelper();
  private razorpayInstance = new RazorpayPG();
  private customerService = new CustomerService();
  private creditScoreUserJourneyService = new CreditScoreUserJourneyService();
  private razorpaySubscriptionService = new RazorpaySubscriptionService();
  private subscriptionPaymentService = new SubscriptionPaymentService();
  private transectionService = new TransectionService();
  private razorpayWebhookLogsService = new RazorpayWebhookLogsService();
  private userSummaryService = new UserSummaryService();
  private cibilApiUtils = new CibilApiUtils();
  private addressService = new AddressService();
  private leadApiLogService = new LeadApiLogService();

  // ! Refactored
  getTermsAndConditions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload: IGetTermsAndConditionsPayload = {
        customerID: req.customer.customerID,
      };
      const { data, message, statusCode } =
        await this.cibilApiUtils.getTermsAndConditions(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // ! Refactored
  updateJourneys = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { step } = req.body;

      let payload: IUpdateJourneysPayload = {
        step,
        customerID: req.customer.customerID,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.updateJourneys(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // ! Refactored
  getJourneyStep = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let payload: IGetJourneyStep = {
        customerID: req.customer.customerID,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.getJourneyStep(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // ! Refactored
  createCheckout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { customerID, name, email, mobile } = req.customer;

      let payload: ICreateCheckoutPayload = {
        customerID,
        name,
        email,
        mobile,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.createCheckout(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // TODO : Refactor
  //handle case when user cancel subscription or money not in user account
  // and check when recurring payment done then what event we recieved
  public subscriptionRazorpayWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | ICustomResponse> => {
    try {
      console.log("webhooks====>>>>>>>", JSON.stringify(req.body));
      await this.razorpayWebhookLogsService.create(
        req?.body?.payload?.subscription?.entity?.id,
        req.body
      );
      const event = req.body?.event;
      console.log(
        "Subscription Rpay events =====>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        event
      );

      switch (event) {
        case "invoice.paid":
          let subscriptionId =
            req?.body?.payload?.invoice?.entity?.subscription_id;
          let paymentInformation = req?.body?.payload?.payment?.entity;
          if (!subscriptionId || !paymentInformation) {
            return this.commonHelper.sendResponse(
              res,
              true,
              "Not Updated",
              {},
              200
            );
          }
          let subscription = await this.razorpaySubscriptionService.findOne(
            {
              razorpay_subscription_id: subscriptionId,
            },
            ["*"],
            [{ column: "id", order: "desc" }]
          );

          if (!subscription) {
            return this.commonHelper.sendResponse(
              res,
              true,
              "Subscription Not Found",
              {},
              400
            );
          }
          let customer = await this.customerService.findOne(
            {
              customerID: subscription.customerID,
            },
            ["mobile"]
          );
          if (!customer) {
            return this.commonHelper.sendResponse(
              res,
              true,
              "Customer Not Found",
              {},
              400
            );
          }
          await this.razorpaySubscriptionService.updateOne(
            {
              razorpay_subscription_id: subscriptionId,
            },
            { status: PaymentCheckoutStatus.ACTIVE }
          );
          await this.subscriptionPaymentService.create(
            subscription.customerID,
            subscription.id,
            paymentInformation?.order_id,
            paymentInformation?.id,
            config.subscriptionAmount,
            config.subscriptionGst,
            paymentInformation?.amount / 100,
            paymentInformation.status == PaymentCheckoutStatus.CAPTURED
              ? PaymentCheckoutStatus.SUCCESS
              : paymentInformation.status,
            JSON.stringify(paymentInformation)
          );
          await this.creditScoreUserJourneyService.updateOne(
            { customerID: subscription.customerID },
            { step: 4 }
          );
          await this.transectionService.create(
            subscription.customerID,
            0,
            "",
            2,
            "subscriptionInvoicePaid",
            "upi",
            paymentInformation?.id,
            paymentInformation?.order_id,
            0,
            "razorpay",
            1,
            1,
            59
          );
          console.log("1. Subscription Invoice Paid:-", event);
          break;
        case "subscription.cancelled":
          //update subscription status cancelled
          //let subscriptionID = req?.body?.payload?.order?.entity?.receipt
          let subscriptionID =
            req?.body?.payload?.invoice?.entity?.subscription_id;
          await this.razorpaySubscriptionService.updateOne(
            {
              razorpay_subscription_id: subscriptionID,
            },
            {
              status: PaymentCheckoutStatus.CANCELLED,
              cancelled_date: moment(new Date(Date.now()))
                .tz("Asia/Kolkata")
                .format("YYYY-MM-DD HH:mm:ss"),
            }
          );
          console.log("subscription cancelled:-", event);

          break;
        default:
      }
      return this.commonHelper.sendResponse(res, true, "Updated", {}, 200);
    } catch (error) {
      console.log("error while hitting webhooks", error);
      logger.info("error in subscriptionRazorpayWebhook", error);
      this.commonHelper.sendResponse(
        res,
        false,
        "Internal Server Error",
        {},
        500
      );
    }
  };

  // ! Refactored
  getPaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const subscriptionid = String(req.query.subscriptionid ?? "");

      let payload: IGetPaymentStatusPayload = {
        subscriptionid,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.getPaymentStatus(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // ! Refactored
  // Developer check types
  experianPull = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers["token"] as string;
      const customerId = req.customer.customerID;
      const name = req.customer.name;
      const payload: IExperianPullPayload = {
        token,
        customerId,
        name,
      };
      const { data, message, statusCode } =
        await this.cibilApiUtils.experianPull(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // Developer check types
  // ! Refactored
  answerQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers["token"] as string;
      const { stgOneHitId, stgTwoHitId, questionId, answer1, answer2 } =
        req.body;
      const customerId = req.customer.customerID;
      const payload: IAnswerQuestionPayload = {
        access_token: token,
        stgOneHitId,
        stgTwoHitId,
        questionId,
        answer1,
        answer2,
        customerId,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.answerQuestions(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // ! Refactored
  paymentCheckout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers["token"] as string;
      const { stgOneHitId, stgTwoHitId, questionId, answer1, answer2 } =
        req.body;

      const payload: IPaymentCheckoutPayload = {
        customerID: req?.customer?.customerID,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.paymentCheckout(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // Developer check types
  // ! Refactored
  updateSubscriptionPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // TODO : Add types
      let payload = {
        requestBody: req.body,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.updateSubscriptionPayment(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // ! Refactored
  getSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let { status, subscriptionID, customerID, sort = "desc" } = req.query;

      const { skip, take } = req.paginate;

      const payload: IGetSubscriptionPayload = {
        status: status as PaymentCheckoutStatus,
        subscriptionID: +subscriptionID,
        customerID: +customerID,
        sort: sort as string,
        skip,
        take,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.getSubscription(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // ! Refactored
  getSubscriptionPayments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let {
        status,
        subscriptionID,
        customerID,
        id,
        orderId,
        paymentId,
        sort = "desc",
      } = req.query;

      const { skip, take } = req.paginate;

      const payload: IGetSubscriptionPayments = {
        status: status as PaymentCheckoutStatus,
        subscriptionId: +subscriptionID,
        customerID: +customerID,
        id: +id,
        orderId: orderId as string,
        paymentId: paymentId as string,
        skip,
        take,
        sort: sort as string,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.getSubscriptionPayments(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // ! Refactored
  getSubscriptionProcess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let {
        step,
        customerID,
        id,
        sortOn = "updatedAt",
        sort = "desc",
      } = req.query;

      const { skip, take } = req.paginate;

      const payload: IGetSubscriptionProcess = {
        step: +step,
        customerID: +customerID,
        id: +id,
        sort: sort as string,
        sortOn: sortOn as TSelectCreditScoreUserJourney,
        skip,
        take,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.getSubscriptionProcess(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  private async prepareCustomerInfo(
    userProfile: ICustomer,
    address: IAddress
  ): Promise<CustomerInfoReqParam> {
    //if (config.appMode <= config.dsModeUat) {
    // cibil test data
    // return {
    //   Name: {
    //     Forename: userProfile.firstName,
    //     Surname: userProfile.lastName,
    //   },
    //   IdentificationNumber: {
    //     IdentifierName: 'TaxId',
    //     Id: userProfile.pancard,
    //   },
    //   Address: {
    //     StreetAddress: address.address,
    //     City: address.city,
    //     PostalCode: address.pincode,
    //     //Region: address.region,
    //     AddressType: address.type,
    //   },
    //   DateOfBirth: userProfile.dob,
    //   PhoneNumber: {
    //     Number: userProfile.mobile,
    //   },
    //   Email: userProfile.email,
    //   Gender: userProfile.gender,
    // }
    return {
      Name: {
        Forename: "BASAVARAJ",
        Surname: "H",
      },
      IdentificationNumber: {
        IdentifierName: "TaxId",
        Id: "VCFPI5822P",
        //Id: 'VCFPI5822P',
        //Id:'COLPD1370S'
      },
      Address: {
        StreetAddress: "YUGESH KUMAR YADAV S/O KARU MAHTO SOMUTO",
        City: "RANCHI",
        PostalCode: 829205,
        Region: "20",
        AddressType: "01",
      },
      DateOfBirth: "1987-10-19",
      PhoneNumber: {
        Number: config.appMode == 4 ? 9899964219 : 9399442128,
      },
      Email:
        config.appMode == 4
          ? "brijesh@ramifincorp.com"
          : "dubeysatyam525@gmail.com",
      Gender: "Female",
    };
    // }

    //const pinCode = address.pincode.toString();
    //const { cityName, regionCode } = await getCityNameAndRegionCode(pinCode);

    // const encryptedData = {
    //   firstName: userProfile.firstName,
    //   lastName: userProfile.lastName,
    //   // middleName: userProfile.middle_name_pub,
    //   mobile: userProfile.mobile,
    //   email: userProfile.email,
    //   pan: userProfile.pancard,
    //   address1: address.address,
    //   address2: address.address2,
    //   //address3: leadProfile.address_3_pub,
    // }

    // let surname = encryptedData.lastName
    // if (encryptedData.lastName) {
    //   surname = encryptedData.lastName
    //     ? encryptedData.firstName + ' ' + encryptedData.lastName
    //     : encryptedData.lastName
    // }

    // let Address = encryptedData?.address1
    // if (encryptedData?.address2) Address += ' ' + encryptedData?.address2
    // //if (encryptedData?.address3) Address += ' ' + encryptedData?.address3;
    // const fixedLengthAddress = getFixedLengthAddress(Address, 40)

    // const CustomerInfo = {
    //   Name: {
    //     Forename: encryptedData.firstName || encryptedData.lastName,
    //     Surname: encryptedData.lastName,
    //   },
    //   IdentificationNumber: {
    //     IdentifierName: 'TaxId',
    //     Id: encryptedData.pan,
    //   },
    //   Address: {
    //     StreetAddress: fixedLengthAddress,
    //     City: address.city,
    //     //Region: regionCode,
    //     PostalCode: address.pincode,
    //     AddressType: address.type,
    //   },
    //   DateOfBirth: userProfile.dob,
    //   PhoneNumber: {
    //     Number: encryptedData?.mobile,
    //   },
    //   Email: encryptedData?.email,
    //   Gender: userProfile.gender,
    // }
    // return CustomerInfo
  }
  public cibilReportStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<serviceResponse> => {
    const { customerId } = req.body;
    let userProfile = await this.customerService.findOne(
      { customerID: customerId },
      [
        "customerID",
        "firstName",
        "pancard",
        "mobile",
        "lastName",
        "dob",
        "email",
        "gender",
      ]
    );
    if (!userProfile) {
      return {
        ok: false,
        err: "Customer not found",
      };
    }
    const address = await this.addressService.findOne(
      { customerID: customerId },
      ["customerID", "type", "address", "city", "pincode", "region", "address2"]
    );
    if (!address) {
      return {
        ok: false,
        err: "Address not found",
      };
    }
    const customerInfo = await this.prepareCustomerInfo(userProfile, address);

    // const pan = userProfile.pancard
    // const mobile = userProfile.mobile.toString()
    console.log("appMode", config.appMode);
    const pan = "VCFPI5822P";
    const mobile = config.appMode == 4 ? "9899964219" : "9399442128";

    // const pan =  'COLPD1370S'
    // const mobile =  '9399442127'
    const shakey = generateSHA1Hash(`${pan}:${mobile.slice(-4)}`);
    const fulfillOfferResp = await this.cibilApiUtils.fulfillOffer(
      customerInfo,
      shakey
    );
    console.log("fulfillofferResp====>>>>>>>>>>>", fulfillOfferResp);
    logger.info(`/credit-report/status fulfillOfferResp: ${fulfillOfferResp}`);

    if (!fulfillOfferResp.ok) {
      const response: serviceResponse = {
        ok: false,
        err: fulfillOfferResp.err,
        data: {
          key: "cibil_report_error",
        },
        // return {
        //   ...fulfillOfferResp,
        //   data: {
        //     key: 'cibil_report_error',
        //   },
        // }
      };
      res.json(response);
      return response;
    }

    let saveResponse = {
      api_supplier: 3,
      api_type: "cibil-ful-fill-Offer",
      api_endpoint_url: "",
      api_method: "POST",
      api_request: req.body,
      api_response: JSON.stringify(fulfillOfferResp),
      status: 1,
      customerId: userProfile.customerID,
    };
    const getAuthQueResp = await this.cibilApiUtils.getAuthenticationQuestions(
      shakey,
      userProfile.customerID
    );
    console.log(
      "getAuthQueResp===================>>>>>>>>>>>>.",
      getAuthQueResp
    );
    if (!getAuthQueResp.ok) return getAuthQueResp;
    console.log("hi====================>>>>>>>>>>.");
    let savelogs = await this.leadApiLogService.create(saveResponse);
    console.log("response in saveLOgs", fulfillOfferResp?.data?.Status);
    console.log("savelogs", savelogs);
    if (savelogs) {
      const response: serviceResponse = {
        ok: true,
        data: {
          creditReportStatus: fulfillOfferResp.data?.Status,
        },
      };
      res.json(response);
      return response;
      // return {
      //   ok: true,
      //   data: {
      //     creditReportStatus: fulfillOfferResp.data?.Status,
      //   },
      // }
    }

    const response: serviceResponse = {
      ok: false,
      err: "INVALID",
      data: {
        key: "credit_report_error",
      },
    };
    res.json(response);
    return response;
  };

  public customerAssets = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<serviceResponse> => {
    try {
      const { customerId } = req.body;

      let userProfile = await this.customerService.findOne(
        { customerID: customerId },
        [
          "customerID",
          "firstName",
          "pancard",
          "mobile",
          "lastName",
          "dob",
          "email",
          "gender",
        ]
      );
      if (!userProfile) {
        return {
          ok: false,
          err: "Customer not found",
        };
      }
      // const pan = userProfile.pancard
      // const mobile = userProfile.mobile.toString()

      // const pan = 'COLPD1370S'
      // const mobile = '9399442127'
      const pan = config.appMode == 4 ? "VCFPI5822P" : "COLPD1370R";
      const mobile = config.appMode == 4 ? "9899964219" : "9399442128";
      const shakey = generateSHA1Hash(`${pan}:${mobile.slice(-4)}`);

      const customerAssetsResp = await this.cibilApiUtils.getCustomerAssets(
        shakey,
        customerId
      );

      if (!customerAssetsResp.ok) {
        const response: serviceResponse = {
          ok: false,
          err: "Failed to retrieve customer assets",
          data: {
            key: "credit_report_error",
            ...customerAssetsResp.data,
          },
        };
        res.json(response);
        return response;
      }

      const response: serviceResponse = {
        ok: true,
        data: customerAssetsResp.data,
      };
      res.json(response);
      return response;
    } catch (error) {
      const response: serviceResponse = {
        ok: false,
        err: error.message,
      };
      res.json(response);
      return response;
    }
  };

  public creditReportAuthVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const requestBody = req.body.requestBody;
    requestBody.leadId = Number(requestBody.leadId);
    requestBody.userId = Number(requestBody.userId);
    // if (config.appMode >= config.dsModeUat) {
    //   requestBody.userId = Number(requestBody.chqbookuserId)
    // }

    const validator = CommonHelper.commonValidations(requestBody, {
      leadId: "required | numeric",
      userId: "required | numeric",
      answer: "required",
    });

    if (validator && validator.length > 0) {
      const errorStatus = logger.error(validator);
      if (errorStatus) {
        return CommonHelper.getSuccessResponse(res, 400, "Failure", false, {
          errors: validator,
        });
      }
    }

    const data = await this.cibilApiUtils.verifyAuthAnswers(requestBody);
    if (!data.ok) {
      logger.error(data.err);
      return CommonHelper.getSuccessResponse(res, 400, "Failure", false, {
        errors: data.err,
        ...data.data,
      });
    }
    return CommonHelper.getSuccessResponse(
      res,
      200,
      "Success",
      true,
      data.data
    );
  };

  public creditReportViewLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const requestBody = req.body;
    requestBody.leadId = Number(requestBody.leadId);
    requestBody.userId = Number(requestBody.userId);

    const validator = CommonHelper.commonValidations(requestBody, {
      userId: "required | numeric",
    });

    if (validator && validator.length > 0) {
      const errorStatus = logger.error(validator);
      if (errorStatus) {
        return CommonHelper.getSuccessResponse(res, 400, "Failure", false, {
          errors: validator,
        });
      }
    }

    const data = await this.cibilApiUtils.getCreditViewLink(requestBody);
    if (!data.ok) {
      logger.error(data.err);
      return CommonHelper.getSuccessResponse(res, 400, "Failure", false, {
        errors: data.err,
        ...data.data,
      });
    }
    return CommonHelper.getSuccessResponse(
      res,
      200,
      "Success",
      true,
      data.data
    );
  };

  public reportSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { provider } = req.query;

      let payload: IReportSummaryPayload = {
        provider: String(provider),
        customerID: req.customer.customerID,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.reportSummary(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public accountDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { accountId } = req.query;

      let payload: IAccountDetailsPayload = {
        accountId: Number(accountId),
        customerID: req.customer.customerID,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.accountDetails(payload);
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public viewImpact = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { impactId } = req.query;

      let payload: IViewImpactPayload = {
        impactId: Number(impactId),
        customerID: req.customer.customerID,
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.viewImpactDetails(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public fetchRazorpayOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customerId = req.customer.customerID;

      let payload: IfecthOrderDetailsPayload = {
        customerId: Number(customerId),
      };

      const { data, message, statusCode } =
        await this.cibilApiUtils.fetchRazorpayOrder(payload);
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };
  cancelExperianSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { data, message, statusCode } =
        await this.cibilApiUtils.cancelExperianSubscription();
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };
}

export default CibilScoreController;
