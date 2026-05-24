import config from "@/config/default";
import CustomerAppModel from "@/database/mysql/customerApp";
import CommonHelper from "@/helpers/common";
import { ICredit } from "@/interfaces/credit.interface";
import * as crypto from "crypto";

import {
  ICustomer,
  ICustomerLoginPayload,
  IEmiSoaPayload,
  IPaymentDetails,
  IRepaymentPagePayload,
} from "@/interfaces/customer.interface";
import { ICustomerApp } from "@/interfaces/customerApp.interface";
import { IEmployer } from "@/interfaces/employer.interface";
import { ILead } from "@/interfaces/lead.interface";
import { IMobileToken } from "@/interfaces/mobileToken.interface";
import { ICustomResponse } from "@/interfaces/response.interface";
import AddressService from "@/services/address.service";
import ApiReqResLogService from "@/services/api_req_res_log.service";
import CallHistoryLogService from "@/services/callhistorylog.service";
import CollectionService from "@/services/collection.service";
import CreditService from "@/services/credit.service";
import CustomerService from "@/services/customer.service";
import CustomerAppService from "@/services/customerApp.service";
import EmiService from "@/services/emi.service";
import EmployerService from "@/services/employer.service";
import LeadService from "@/services/lead.service";
import LeadApiLogService from "@/services/lead_api_log.service";
import LoanService from "@/services/loan.service";
import MobileTokenService from "@/services/mobile_token.service";
import OnlinePaymentService from "@/services/onlinepayment.service";
import OnlinePaymentLogService from "@/services/onlinepaymentlog.services";
import { phpLogIn } from "@/services/php.service";
import RazorpayWebhookLogsLogService from "@/services/razorpaywebhooklogs";
import RazorpayLogService from "@/services/razorpay_logs.service";
import ResponseService from "@/services/response.service";
import TransectionService from "@/services/teansections.services";
import DigitapService from "@/services/thirdParty/digitap.service";
// import { finboxservice } from '@/services/thirdParty/finbox.service'
// import { LenderCredentials } from "@/common/common-module/src/enums/lender.enum";
// import { razorPayPayments } from "@/common/common-module/src/utils/razorpayClient.utils";
import { approvalModel } from "@/database/mysql/approval";
import CreditModel from "@/database/mysql/credit";
import LeadModel from "@/database/mysql/leads";
import LoanModel from "@/database/mysql/loan";
import { razorpayMandateModel } from "@/database/mysql/razorpay_mandate";
import { stepControlModel } from "@/database/mysql/step-control";
import { stepTrackerModel } from "@/database/mysql/step_tracker";
import TransactionModel from "@/database/mysql/transactionModel";
import { BankAccountStatus } from "@/enums/customerBankAccount.enum";
import { NameMatchType } from "@/enums/finboxNameMatch.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import {
  BadRequestError,
  FaultyStepError,
  NotAcceptableError,
  NotFoundError,
  PreconditionError,
} from "@/errors";
import { IRazorpayPaydayRepayment } from "@/interfaces/collection.interface";
import { IRazorpayRepayment, IUtmSource } from "@/interfaces/common.interface";
import { ICustomerCheckDetails } from "@/interfaces/onboarding.interface";
import { ICreateOTP, IVerifyOTP } from "@/interfaces/otp.interface";
import { ITransection } from "@/interfaces/transections.interface";
import { CollectionCrmService } from "@/services/collectionCrm.service";
import CustomerAccountService from "@/services/customerAccount.service";
import { customerNameMatchservice } from "@/services/customerNameMatch.service";
import DocumentService from "@/services/document.service";
import EmiCollectionService from "@/services/emiCollection.service";
import { onboardingservice } from "@/services/onboarding.service";
import FinboxService from "@/services/thirdParty/finbox.service";
import S3Service, { s3Service } from "@/services/thirdParty/s3.service";
import { getAccessToken, getUserInfo } from "@/services/trueCaller.service";
import {
  getAccessTokenDigilocker,
  verifyAadharWithDigilocker,
} from "@/utils/digilocker.utils";
import { logger } from "@/utils/logger";
import { IApiResponse, validateEmailHelper } from "@/utils/msg91";
import { getKnexInstance } from "@/utils/mysql";
import RazorpayPG from "@/utils/razorpayClient.utils";
import {
  getNameMatchPercentage,
  matchPanAadhaarDob,
} from "@/utils/surePass.utils";
import { Mutex } from "async-mutex";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { LRUCache } from "lru-cache";
import path from "path";
export interface IAuthenticatedRequest extends Request {
  customer: ICustomer;
}
const paymentLocks = new LRUCache<string, Mutex>({
  max: 2000,
  ttl: 30 * 60 * 1000, // 30 Minutes
});
class CustomersController extends ResponseService {
  private customerService = new CustomerService();
  private creditService = new CreditService();
  private razorpayLogService = new RazorpayLogService();
  private onlinePaymentServices = new OnlinePaymentService();
  private onlinePaymentLogService = new OnlinePaymentLogService();
  private emiService = new EmiService();
  private callHistoryLogService = new CallHistoryLogService();
  private collectionService = new CollectionService();
  private loanService = new LoanService();
  private leadService = new LeadService();
  private razorpayWebhookLogsLogService = new RazorpayWebhookLogsLogService();
  private transectionService = new TransectionService();
  private employerService = new EmployerService();
  private commonHelper = new CommonHelper();
  private razorpayInstance = new RazorpayPG();
  private customerAppService = new CustomerAppService();
  private mobileTokenService = new MobileTokenService();
  private addressService = new AddressService();
  private razorpayMandateModel = razorpayMandateModel;
  private leadApiLogService = new LeadApiLogService();
  private apiReqResLogService = new ApiReqResLogService();
  private customerAppModel = new CustomerAppModel();
  private finboxService = new FinboxService();
  private s3Service = new S3Service();
  private customerAccountService = new CustomerAccountService();
  private digitapService = new DigitapService();
  private documentService = new DocumentService();
  private onboardingservice = onboardingservice;
  private stepTrackerModel = stepTrackerModel;
  private stepControlModel = stepControlModel;

  private emiCollectionService = new EmiCollectionService();
  private creditModel = new CreditModel();
  private loanModel = new LoanModel();
  private collectionCrmService = new CollectionCrmService();
  private transactionModel = new TransactionModel();
  private leadModel = new LeadModel();
  private approvalModel = approvalModel;
  // private razorPayPayments = razorPayPayments;

  public customerLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        mobile,
        app_id: appID,
        imei,
      } = req.validatedBody as ICustomerLoginPayload;

      const payload: ICustomerLoginPayload = {
        mobile,
        app_id: appID,
        imei,
      };

      const { data, message, statusCode } =
        await this.customerService.customerLogin(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public otp_verify = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { request_id, otp } = req.validatedBody;

      let { data, message, statusCode } = await this.customerService.verifyOtp(
        req,
        request_id,
        otp,
      );
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  public email_validation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<object> => {
    try {
      const data = req.body;
      const validatorParams = {
        email: "required | email",
        customer_id: "required | numeric",
      };
      const validator = CommonHelper.commonValidations(data, validatorParams);
      if (validator && validator.length > 0) {
        const errorStatus = logger.error(validator);
        if (errorStatus) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Error",
            { ...validator },
            400,
          );
        } else {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Error",
            { errors: "Something went wrong with the logger" },
            401,
          );
        }
      } else {
        const email = data?.email;
        const customerID = data?.customer_id;

        const apiResponse = (await validateEmailHelper(email)) as IApiResponse;

        let statusCode: number = 0;
        let messageCode: string = "Invalid Email";
        let responseData: object = {};

        if (
          apiResponse.data.result?.valid &&
          (apiResponse.data.result.result === "deliverable" ||
            apiResponse.data.result.result === "risky")
        ) {
          statusCode = 1;
          messageCode = "Valid Email";
          responseData = apiResponse.data;

          const updateFields = {
            email_verification_status: statusCode,
            email_delivery_status: apiResponse.data.result.result,
            email_last_validation: apiResponse.data.updated_at.split("T")[0],
          };
          await this.customerAppModel.findOneAndUpdate(
            { customerID: customerID },
            updateFields,
          );
        }

        const response = {
          status: statusCode,
          message: messageCode,
          data: responseData,
        };
        return res.json(response);
      }
    } catch (error: any) {
      console.log("Error at email validation:", error.message);
      return this.commonHelper.sendResponse(
        res,
        false,
        "Error",
        { error: "Internal server error" },
        500,
      );
    }
  };
  public razorpayPayment = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const data = req.body;
    const { creditID, amount, preClosure } = data;

    // Validate request
    const validationError = this.emiCollectionService.validateRequest(data);
    if (validationError) {
      return this.commonHelper.sendResponse(
        res,
        false,
        "Invalid Request Body",
        validationError,
        400,
      );
    }

    // Fetch credit details
    const credit = (await this.creditService.getCredit({
      creditID,
      status: "disbursed",
    })) as ICredit;
    if (!credit) {
      return this.commonHelper.sendResponse(
        res,
        false,
        "Wrong Credit Id | Loan Is Closed",
        {},
        400,
      );
    }

    // Fetch loan details
    const loan = await this.loanService.findOne({ leadID: credit.leadID }, [
      "loanID",
      "disbursalDate",
    ]);

    if (preClosure) {
      return this.emiCollectionService.handlePreClosure(req, res, credit, loan);
    } else {
      return this.emiCollectionService.handleDuePayment(
        req,
        res,
        credit,
        amount,
      );
    }
  };

  public updateEMIPayment = async (
    req: Request,
    res: Response,
  ): Promise<Response | void> => {
    const paymentDetails = req?.body?.payload?.payment?.entity;
    const orderId = paymentDetails?.order_id;

    if (!paymentDetails || !orderId) {
      return this.commonHelper.sendResponse(
        res,
        false,
        "Invalid Body",
        {},
        400,
      );
    }

    if (paymentDetails.amount) {
      paymentDetails.amount = paymentDetails.amount / 100;
    }
    const payload = req?.body?.payload
      ? JSON.stringify(req.body.payload)
      : null;

    let mutex = paymentLocks.get(orderId);
    if (!mutex) {
      mutex = new Mutex();
      paymentLocks.set(orderId, mutex);
    }

    return mutex.runExclusive(async () => {
      const transaction = (await this.transectionService.findOne(
        { orderId: orderId, status: 1 },
        { orderKey: "id", orderValue: "desc" },
        ["*"],
      )) as ITransection;

      if (transaction) {
        return this.commonHelper.sendResponse(
          res,
          true,
          "Payment already Update",
          {},
          200,
        );
      }
      try {
        const onlinePayment = await this.emiCollectionService.findOnlinePayment(
          orderId,
        );
        if (!onlinePayment) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Payment not found",
            {},
            404,
          );
        }

        await this.emiCollectionService.logPaymentUpdate(
          onlinePayment.pID,
          paymentDetails,
          payload,
        );

        await this.emiCollectionService.updatePaymentStatus(
          onlinePayment,
          paymentDetails,
        );

        const credit = await this.emiCollectionService.findCredit(
          +onlinePayment.leadID,
        );
        if (!credit) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Credit Not Found",
            {},
            400,
          );
        }
        const loan = await this.emiCollectionService.findLoan(credit.leadID);

        if (!loan) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Loan Not Found",
            {},
            400,
          );
        }

        let transID = await this.emiCollectionService.handleTransaction(
          paymentDetails,
          credit,
          loan,
          1,
        );
        if (transID === 0) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Error while inserting data in transection table",
            {},
            400,
          );
        }

        paymentDetails.trans = {};
        if (paymentDetails.status === "captured") {
          paymentDetails.trans.order_id = orderId;
          paymentDetails.trans.id = transID;
          await this.emiCollectionService.processManualPayment(
            paymentDetails,
            credit,
            loan,
          );
        }

        return this.commonHelper.sendResponse(
          res,
          true,
          "Payment Update",
          {},
          200,
        );
      } catch (error) {
        console.error("Error in updateEMIPayment:", error);
        return this.commonHelper.sendResponse(
          res,
          false,
          "Internal Server Error",
          {},
          500,
        );
      }
    });
  };
  public updateEMIPaymentPayu = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const paymentDetails = req.body;
      const payload = req?.body ? JSON.stringify(req.body) : null;

      if (!paymentDetails) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Incorrect Body",
          {},
          400,
        );
      }

      const onlinePayment = await this.emiCollectionService.findOnlinePayment(
        paymentDetails.order_id,
      );
      if (!onlinePayment) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Payment not found",
          {},
          404,
        );
      }
      console.log("------payment logs");
      await this.emiCollectionService.updatePaymentStatus(
        onlinePayment,
        paymentDetails,
      );
      console.log("------update status");
      const credit = await this.emiCollectionService.findCredit(
        +onlinePayment.leadID,
      );

      if (!credit) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Credit Not Found",
          {},
          400,
        );
      }

      const loan = await this.emiCollectionService.findLoan(credit.leadID);

      if (!loan) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Loan Not Found",
          {},
          400,
        );
      }

      const transaction = (await this.transectionService.findOne(
        { orderId: paymentDetails.order_id, status: 1 },
        { orderKey: "id", orderValue: "desc" },
        ["*"],
      )) as ITransection;
      if (transaction) {
        return this.commonHelper.sendResponse(
          res,
          true,
          "Payment already  Update",
          {},
          200,
        );
      }
      let transID = await this.emiCollectionService.handleTransaction(
        paymentDetails,
        credit,
        loan,
        2,
      );
      if (transID === 0) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Error while inserting data in transection table",
          {},
          400,
        );
      }
      paymentDetails.trans = {};
      if (paymentDetails.status === "captured") {
        paymentDetails.trans.order_id = paymentDetails.order_id;
        paymentDetails.trans.id = transID;
        await this.emiCollectionService.processManualPayment(
          paymentDetails,
          credit,
          loan,
        );
      }

      return this.commonHelper.sendResponse(
        res,
        true,
        "Payment Update",
        {},
        200,
      );
    } catch (error) {
      console.error("Error in updateEMIPaymentPayu:", error);
      return this.commonHelper.sendResponse(
        res,
        true,
        "Internal Server Error",
        {},
        500,
      );
    }
  };

  public updateEMIPaymentPayuBiller = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const paymentDetails = req.body;
      const payload = req?.body ? JSON.stringify(req.body) : null;

      if (!paymentDetails) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Incorrect Body",
          {},
          400,
        );
      }

      const onlinePayment = await this.emiCollectionService.findOnlinePayment(
        paymentDetails.order_id,
      );
      if (!onlinePayment) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Payment not found",
          {},
          404,
        );
      }

      // Find transaction details
      const transaction =
        (await this.emiCollectionService.callFindOneTransection(
          paymentDetails.order_id,
        )) as ITransection;
      if (transaction) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Transaction already exist",
          {},
          400,
        );
      }

      console.log("------payment logs");
      await this.emiCollectionService.updatePaymentStatus(
        onlinePayment,
        paymentDetails,
      );
      console.log("------update status");
      const credit = await this.emiCollectionService.findCredit(
        +onlinePayment.leadID,
      );
      if (!credit) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Credit Not Found",
          {},
          400,
        );
      }
      const loan = await this.emiCollectionService.findLoan(credit.leadID);
      if (!loan) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Loan Not Found",
          {},
          400,
        );
      }
      let transID = await this.emiCollectionService.handleTransaction(
        paymentDetails,
        credit,
        loan,
        3,
      );
      paymentDetails.trans = {};
      if (paymentDetails.status === "captured") {
        paymentDetails.trans.order_id = paymentDetails.order_id;
        paymentDetails.trans.id = transID;
        await this.emiCollectionService.processManualPayment(
          paymentDetails,
          credit,
          loan,
        );
      }

      return this.commonHelper.sendResponse(
        res,
        true,
        "Payment Update",
        {},
        200,
      );
    } catch (error) {
      return this.commonHelper.sendResponse(
        res,
        true,
        "Internal Server Error",
        {},
        500,
      );
    }
  };

  private generateHash = async (
    tnxid: string,
    payUkey: string,
    payUsalt: string,
  ): Promise<string> => {
    let command = "verify_payment";

    const hashSequence = `${payUkey}|${command}|${tnxid}|${payUsalt}`;
    return crypto
      .createHash("sha512")
      .update(hashSequence)
      .digest("hex")
      .toLowerCase();
  };

  public managePaymentCron = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const order_id = req.body?.order_id;

      // Validate the order_id
      if (!order_id) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Order ID is required",
          {},
          400,
        );
      }

      let paymentDetails: any = {};

      // Find the online payment
      const onlinePayment = await this.emiCollectionService.findOnlinePayment(
        order_id,
      );
      if (!onlinePayment) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Payment not found",
          {},
          404,
        );
      }

      console.log("------ Updating payment status ------");

      // Find credit details
      const credit = await this.emiCollectionService.findCredit(
        +onlinePayment.leadID,
      );
      if (!credit) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Credit information not found",
          {},
          404,
        );
      }

      // Find loan details
      const loan = await this.emiCollectionService.findLoan(credit.leadID);
      if (!loan) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Loan information not found",
          {},
          404,
        );
      }

      // Find transaction details
      const transaction =
        (await this.emiCollectionService.callFindOneTransection(
          order_id,
        )) as ITransection;
      if (!transaction) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Transaction not found",
          {},
          404,
        );
      }

      // Initialize transaction details
      paymentDetails.trans = {};

      // if (transaction.status === 2) {
      paymentDetails.trans.order_id = order_id;
      paymentDetails.trans.id = transaction.id;
      paymentDetails.amount = transaction.amount || 0;
      paymentDetails.paymentDate =
        transaction.transactionDate && transaction.transactionDate != null
          ? transaction.transactionDate
          : transaction.createdAt;

      await this.emiCollectionService.processManualPayment(
        paymentDetails,
        credit,
        loan,
      );

      return this.commonHelper.sendResponse(
        res,
        true,
        "Payment updated successfully.",
        {},
        200,
      );
    } catch (error) {
      console.error("Error in managePaymentCron:", error);

      return this.commonHelper.sendResponse(
        res,
        false,
        "Internal Server Error",
        {},
        500,
      );
    }
  };

  public updateEMIManualPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { transactionID } = req?.body;

      // Validate the request body
      if (!transactionID) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Incorrect Body",
          {},
          400,
        );
      }

      // Fetch the transaction details
      const transaction = (await this.transectionService.findOne(
        { id: transactionID },
        { orderKey: "createdAt", orderValue: "desc" },
        ["*"],
      )) as ITransection;

      if (!transaction) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Transaction not found for the given criteria",
          {},
          400,
        );
      }

      if (transaction.status != 2) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "This transaction is already settled with the EMIs",
          {},
          200,
        );
      }

      // Update transaction status
      await this.transectionService.updateOne(
        { id: transactionID },
        { status: 3 },
      );

      console.log(transaction);

      // Fetch related entities: credit and loan
      const credit = await this.emiCollectionService.findCredit(
        transaction.leadID,
      );
      if (!credit) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Credit Not Found",
          {},
          400,
        );
      }

      const loan = await this.emiCollectionService.findLoan(credit.leadID);

      if (!loan) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Loan Not Found",
          {},
          400,
        );
      }
      let paymentDetails: IPaymentDetails = {
        amount: 0,
        paymentDate: new Date(),
        trans: {},
      };

      // Handle different transaction statuses
      if (transaction.payment_transaction_status === "collect_overdue_emi") {
        paymentDetails.amount = transaction.amount;
        paymentDetails.paymentDate = transaction.transactionDate;
        // paymentDetails.trans = transaction
        paymentDetails.trans.id = transaction.id;
        paymentDetails.trans.order_id = transaction.orderId;
        await this.emiCollectionService.processManualPayment(
          paymentDetails,
          credit,
          loan,
        );
      } else if (
        transaction.payment_transaction_status === "collect_final_settlement"
      ) {
        const {
          amount: remainingAmount,
          waiver,
          leadID,
          customerID,
          discount_type,
        } = transaction;

        await this.emiCollectionService.manageManualPayment(
          remainingAmount,
          waiver,
          leadID,
          customerID,
          discount_type,
          transaction.id,
          transaction.orderId,
        );
      } else {
        // Handle any unexpected status (if necessary)
        return this.commonHelper.sendResponse(
          res,
          false,
          "Invalid transaction status",
          {},
          400,
        );
      }

      // Return success response
      return this.commonHelper.sendResponse(
        res,
        true,
        "Payment Updated",
        {},
        200,
      );
    } catch (error) {
      console.error("Error updating EMI manual payment:", error);
      return this.commonHelper.sendResponse(
        res,
        false,
        "Internal Server Error",
        {},
        500,
      );
    }
  };

  public truecallerLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      let data = req.body;
      const validatorParams = {
        grant_type: "required | string",
        client_id: "required | string",
        code_verifier: "required | string",
        code: "required | string",
        appID: "required",
      };

      const validator = await CommonHelper.commonValidations(
        data,
        validatorParams,
      );
      if (validator && validator.length > 0) {
        const errorStatus = logger.error(validator);
        if (errorStatus) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Invalid Request Body",
            { ...validator },
            400,
          );
        } else {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Invalid Request Body",
            { errors: "Somthing issue in logger" },
            400,
          );
        }
      } else {
        let grant_type = data.grant_type;
        let client_id = data.client_id;
        let code_verifier = data.code_verifier;
        let code = data.code;
        let androidId = data?.android_id;
        let firebaseToken = data?.firebase_token;
        let appID = data?.appID;
        let imei = data.imei ?? "NA";
        let token = await getAccessToken({
          grant_type,
          client_id,
          code_verifier,
          code,
        });
        if (token) {
          let userinfo = await getUserInfo(token);
          if (!userinfo) {
            return this.commonHelper.sendResponse(
              res,
              false,
              ` Issue In Fetching UserInfo From TC`,
              {},
              400,
            );
          }
          let customer = (await this.customerService.findOne(
            { mobile: userinfo?.phone_number.substring(2) },
            ["*"],
          )) as ICustomer;
          if (!customer) {
            let customerApp = (await this.customerAppService.findOne(
              { mobile: userinfo?.phone_number.substring(2) },
              ["*"],
            )) as ICustomerApp;
            if (customerApp) {
              let data = await phpLogIn(
                Number(customerApp.mobile),
                3803,
                firebaseToken,
                androidId,
              );
              // const now: Date = new Date(Date.now())
              // const authData = `${customerApp.customerID}/${customerApp.mobile}/${now}`
              // const authCode = CommonHelper.aesEncryption(authData)
              // this.customerService.isLoggedInAnotherDevice(
              //   androidId,
              //   `${customerApp.mobile}`,
              //   `${customerApp.customerID}`,
              // )
              // await this.mobileTokenService.updateOne(
              //   {
              //     mobile: `${customerApp.mobile}`,
              //     customerID: `${customerApp.customerID}`,
              //   },
              //   {
              //     customerID: `${customerApp.customerID}`,
              //     access_token: authCode,
              //     last_login: new Date(Date.now()),
              //     androidId,
              //     firebaseToken,
              //   },
              // )
              // return this.commonHelper.sendResponse(
              //   res,
              //   true,
              //   'Logged In',
              //   { ...data },
              //   200,
              // )
              return res.json(data);
            } else {
              //fresh user
              //create entry in customerApp and mobile token table and send token
              await this.customerAppService.create({
                mobile: +userinfo?.phone_number.substring(2),
                firstName: userinfo?.given_name,
                lastName: userinfo?.family_name,
                name: `${userinfo?.given_name} ${userinfo?.family_name}`,
                gender: userinfo?.gender,
              });
              let newCustomerApp = (await this.customerAppService.findOne(
                { mobile: userinfo?.phone_number.substring(2) },
                ["*"],
              )) as ICustomerApp;
              const now: Date = new Date(Date.now());
              // const authData = `${newCustomerApp.customerID}/${newCustomerApp.mobile}/${now}`
              // const authCode = CommonHelper.aesEncryption(authData)
              await this.mobileTokenService.create({
                customerID: newCustomerApp.customerID,
                mobile: newCustomerApp.mobile,
                appID: appID,
                credatedDate: now,
                imei: imei,
                access_token: "abc",
                last_login: now,
              });
              //call api
              let data = await phpLogIn(
                Number(newCustomerApp.mobile),
                3803,
                firebaseToken,
                androidId,
              );
              return res.json(data);
              // return this.commonHelper.sendResponse(
              //   res,
              //   true,
              //   'Logged In',
              //   { ...data },
              //   200,
              // )
            }
          } else {
            // call api

            // const now: Date = new Date(Date.now())
            // const authData = `${customer.customerID}/${customer.mobile}/${now}`
            // const authCode = CommonHelper.aesEncryption(authData)
            // this.customerService.isLoggedInAnotherDevice(
            //   androidId,
            //   `${customer.mobile}`,
            //   `${customer.customerID}`,
            // )
            // await this.mobileTokenService.updateOne(
            //   {
            //     mobile: `${customer.mobile}`,
            //     customerID: `${customer.customerID}`,
            //   },
            //   {
            //     customerID: `${customer.customerID}`,
            //     access_token: authCode,
            //     last_login: new Date(Date.now()),
            //     androidId,
            //     firebaseToken,
            //   },
            // )
            let data = await phpLogIn(
              customer.mobile,
              3803,
              firebaseToken,
              androidId,
            );
            return res.json(data);
            // return this.commonHelper.sendResponse(
            //   res,
            //   true,
            //   'Logged In',
            //   { ...data },
            //   200,
            // )
          }
        } else {
          return this.commonHelper.sendResponse(
            res,
            false,
            ` Issue In Fetching Access Token From TC`,
            {},
            400,
          );
        }
      }
    } catch (error) {
      // console.log(error)
      return this.commonHelper.sendResponse(
        res,
        false,
        `Internal Server Error`,
        { error },
        500,
      );
    }
  };

  public incompleteDetailsUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    let request = JSON.stringify(req?.body);
    try {
      let data = req.body;
      let customerID = req?.customer?.customerID;
      let mobile = req?.customer?.mobile;
      let leadID = data?.loan_id;
      let callBackUrl = data?.finboxCallBackUrl;

      let customer = (await this.customerService.findOne(
        { customerID, mobile },
        ["*"],
      )) as ICustomer;

      if (!customer) {
        throw new NotFoundError("customer not found");
      }

      let mobileToken = (await this.mobileTokenService.findOne(
        {
          customerID: String(customerID),
          mobile: String(mobile),
        },
        ["*"],
        [{ column: "id", order: "desc" }],
      )) as IMobileToken;

      if (!mobileToken) {
        throw new NotFoundError("mobile token not found");
      }

      let message = "Details updated successfully";
      let statusCode = 200;
      let responseData = {};
      let salary_date = data.salary_date;
      let loanRequeried = data.loan_required;
      let purposeloan = data.loan_purpose;
      let companyName = data.company_name;
      let monthlyIncome = data.monthly_income;
      let salaryMode = data.salary_mode;
      let employeeType = data.employee_type;
      let repeat = req?.validatedBody?.repeat;
      let lead: ILead;
      let newLeadCreated = false;

      const addressData = await this.addressService.findOne(
        { customerID },
        ["address", "state", "city", "pincode", "landmark"],
        [{ column: "addressID", order: "desc" }],
      );

      let residenceAddress = addressData?.address;
      let state = addressData?.state;
      let city = addressData?.city;
      let pincode = addressData?.pincode;
      let landmark = addressData?.landmark;

      // Update customer data first
      let customerUpdates = {};
      if (salary_date) {
        customerUpdates = { ...customerUpdates, salary_date };
      }
      if (employeeType) {
        customerUpdates = { ...customerUpdates, employeeType };
      }
      if (Object.keys(customerUpdates).length > 0) {
        await this.customerService.updateOne({ customerID }, customerUpdates);
      }

      if (!leadID) {
        const currentLender = config.current_lender;
        const userIp = this.commonHelper.getClientIp(req);
        const newLeadResult = await this.leadService.createNewLead(
          Number(customerID),
          "New Case",
          userIp,
          "",
          currentLender,
        );
        leadID = newLeadResult.leadID;
        newLeadCreated = true;
        responseData = {
          leadID: leadID,
          lenderID: currentLender,
        };
        message = "New lead created and details updated successfully.";
      }

      lead = (await this.leadService.findOne({ leadID: leadID, customerID }, [
        "leadID",
        "customerID",
        "status",
        "monthlyIncome",
        "salaryMode",
        "fbLeads",
        "lenderID",
      ])) as ILead;

      if (!lead) {
        throw new NotFoundError("Loan not found.");
      }
      responseData = {
        ...responseData,
        lenderID: lead.lenderID,
      };
      // Aadhaar-PAN Name Mismatch Check - Run after lead is created
      const panLeadApiLogData =
        await this.leadApiLogService.findPanComprehensiveResponseByCustomerIDDigitap(
          Number(customerID),
        );
      if (!panLeadApiLogData) {
        throw new BadRequestError("Failed to get PAN CARD data", {
          data: {},
        });
      }

      const aadhaarLeadApiLogData = await this.leadApiLogService.findOne(
        {
          customerID,
          api_type: LeadLogApiType.DIGITAP_GET_DIGILOCKER_DETAILS,
        },
        ["api_response"],
        [{ column: "id", order: "desc" }],
      );

      if (!aadhaarLeadApiLogData?.api_response) {
        throw new BadRequestError("Unable to find the Aadhaar Response");
      }

      let aadhaarResponse;
      try {
        aadhaarResponse = JSON.parse(aadhaarLeadApiLogData.api_response);
      } catch (parseError) {
        console.error("Failed to parse Aadhaar API response:", parseError);
        return this.commonHelper.sendResponse(
          res,
          false,
          "Unable to parse Aadhaar response",
          {},
          500,
        );
      }
      const aadhaarName = aadhaarResponse?.model?.name;
      const aadhaarDobRaw = aadhaarResponse?.model?.dob;
      const [day, month, year] = aadhaarDobRaw.split("-");
      const aadhaarDob = `${year}-${month}-${day}`;

      console.log("aadhaarName", aadhaarResponse);
      console.log("aadhaarDob", aadhaarDob);
      console.log("panLeadApiLogData.full_name", panLeadApiLogData.full_name);
      console.log("panLeadApiLogData.dob", panLeadApiLogData.dob);

      if (
        !aadhaarName ||
        !panLeadApiLogData.full_name ||
        !aadhaarDob ||
        !panLeadApiLogData.dob
      ) {
        throw new BadRequestError(
          "Unable to find the Aadhaar Response or Pan Response",
        );
      }

      const dobMatchResponse = await matchPanAadhaarDob(
        aadhaarDob,
        panLeadApiLogData.dob,
      );
      if (!dobMatchResponse) {
        throw new BadRequestError("Aadhaar DOB and PAN DOB Mismatch");
      }

      /* if (
        !customer.aadharNo ||
        customer.aadharNo.slice(-4) !==
          panLeadApiLogData.masked_aadhaar.slice(-4)
      ) {
        throw new BadRequestError("Aadhaar Number Mismatch");
      } */

      // --------------------
      // Aadhaar Number Match Logic (With Fallback)
      // --------------------

      if (!customer.aadharNo) {
        throw new BadRequestError("Aadhaar Number Mismatch");
      }

      const fullAadhaar = String(customer.aadharNo).replace(/\s/g, "");
      const maskedAadhaar = String(
        panLeadApiLogData.masked_aadhaar || "",
      ).replace(/\s/g, "");

      let aadhaarMatched = false;

      // 1️⃣ Primary → Last 4 comparison
      if (
        fullAadhaar.slice(-4) === maskedAadhaar.slice(-4) &&
        /^\d{4}$/.test(maskedAadhaar.slice(-4))
      ) {
        aadhaarMatched = true;
      }

      // 2️⃣ Fallback → First 2 + Last 2
      if (!aadhaarMatched) {
        const first2Full = fullAadhaar.slice(0, 2);
        const last2Full = fullAadhaar.slice(-2);

        const first2Masked = maskedAadhaar.slice(0, 2);
        const last2Masked = maskedAadhaar.slice(-2);

        if (
          /^\d{2}$/.test(first2Masked) &&
          /^\d{2}$/.test(last2Masked) &&
          first2Full === first2Masked &&
          last2Full === last2Masked
        ) {
          aadhaarMatched = true;
        }
      }

      // 3️⃣ Fallback → Only Last 2
      if (!aadhaarMatched) {
        const last2Full = fullAadhaar.slice(-2);
        const last2Masked = maskedAadhaar.slice(-2);

        if (/^\d{2}$/.test(last2Masked) && last2Full === last2Masked) {
          aadhaarMatched = true;
        }
      }

      // Final decision
      if (!aadhaarMatched) {
        throw new BadRequestError("Aadhaar Number Mismatch");
      }

      const nameMatchResponse = await getNameMatchPercentage(
        panLeadApiLogData.full_name,
        aadhaarName,
      );

      if (nameMatchResponse < 70) {
        throw new BadRequestError("Aadhaar name and PAN name didn't match", {
          data: {},
        });
      }

      const baseRecordData = {
        customer_id: Number(customerID),
        lead_id: leadID,
        mobile_no: mobile.toString(),
      };

      const recordsToCreate = [
        // DOB match record
        {
          ...baseRecordData,
          type: NameMatchType.AADHAAR_PAN_DOB_EMPLOYMENT,
          first_name: aadhaarDob,
          second_name: panLeadApiLogData.dob,
          percentage: "100",
          percentage_data: JSON.stringify({
            pandob: panLeadApiLogData.dob,
            aadhaardob: aadhaarDob,
            percentage: 100,
          }),
          status: 1,
        },
        // Name match record
        {
          ...baseRecordData,
          type: NameMatchType.AADHAAR_PAN_NAME_EMPLOYMENT,
          first_name: panLeadApiLogData.full_name,
          second_name: aadhaarName,
          percentage: String(nameMatchResponse),
          percentage_data: JSON.stringify({
            panName: panLeadApiLogData.full_name,
            aadhaarName,
            percentage: nameMatchResponse,
          }),
          status: 1,
        },
      ];
      await Promise.all(
        recordsToCreate.map((record) =>
          customerNameMatchservice.create(record),
        ),
      );

      if (purposeloan && leadID) {
        if (customer && mobileToken) {
          if (lead.status === LeadStatus.INCOMPLETE_USER || newLeadCreated) {
            await this.leadService.updateOne(
              {
                customerID,
                leadID,
              },
              { purpose: purposeloan },
            );
          } else {
            throw new FaultyStepError(
              "Not Allowed - Lead status invalid for loan purpose update.",
            );
          }
        }
      }

      if (loanRequeried) {
        if (customer && mobileToken && leadID) {
          if (lead.status === LeadStatus.INCOMPLETE_USER || newLeadCreated) {
            await this.leadService.updateOne(
              {
                customerID,
                leadID,
              },
              { loanRequeried },
            );
          } else {
            throw new FaultyStepError(
              "Not Allowed - Lead status invalid for loan amount update.",
            );
          }
        }
      }

      if (monthlyIncome) {
        if (customer && mobileToken && leadID) {
          if (lead.status === LeadStatus.INCOMPLETE_USER || newLeadCreated) {
            await this.leadService.updateOne(
              {
                customerID,
                leadID,
              },
              { monthlyIncome },
            );
          }
        }
      }

      if (salaryMode) {
        if (customer && mobileToken && leadID) {
          if (lead.status === LeadStatus.INCOMPLETE_USER || newLeadCreated) {
            await this.leadService.updateOne(
              {
                customerID,
                leadID,
              },
              { salaryMode },
            );
          }
        }
      }

      if (companyName) {
        let result: number | ICustomResponse;
        if (customer && mobileToken && leadID) {
          let employer = (await this.employerService.findOne(
            { customerID, employerName: companyName },
            ["employerName"],
            [{ column: "employerID", order: "desc" }],
          )) as IEmployer;

          if (!employer) {
            let employerData = {
              customerID,
              employerName: companyName,
              currentCompany: "",
              verifiedBy: 1,
              is_verified_email: "No",
              status: "Not Verified",
              createdDate: new Date(Date.now()),
              totalExperience: "",
              address: "NA",
              city: "NA",
              state: "NA",
              pincode: "000000",
            };
            await this.employerService.create(employerData);
          } else {
            result = await this.employerService.updateOne(
              { customerID },
              { employerName: companyName },
            );
          }
        }
      }

      if (residenceAddress && state && city && pincode && leadID) {
        console.log("Processing address logic with leadID:", leadID);

        if (
          lead.fbLeads === "Repeat Case" ||
          lead.fbLeads === "Existing Case" ||
          repeat
        ) {
          const oldLead = await this.leadService.findOneLead({
            where: {
              customerID,
            },
            select: ["lenderID"],
          });

          await this.leadService.updateOne(
            { leadID, customerID },
            { lenderID: oldLead.lenderID },
          );
          console.log(
            "Updated lenderID for repeat/existing case with leadID:",
            leadID,
          );

          statusCode = 200;
          message = "Employment details updated successfully";
          responseData = {
            loan_id: leadID,
          };
        } else {
          if (lead.status !== LeadStatus.INCOMPLETE_USER) {
            throw new NotAcceptableError("", { data: { route: "/dashboard" } });
          }

          await this.leadService.updateOne(
            { leadID, customerID },
            { lenderID: lead.lenderID },
          );
          console.log("Updated lenderID for new case with leadID:", leadID);

          await this.leadService.updateOne(
            { leadID, customerID },
            { status: LeadStatus.FRESH_LEAD, sanctionalloUID: 1 },
          );

          if (customer && mobileToken && leadID) {
            await this.addressService.updateOne(
              { customerID },
              {
                address: residenceAddress,
                state: state,
                city: city,
                pincode: pincode,
              },
            );

            statusCode = 200;
            message = "Employment details updated successfully";
            responseData = {
              loan_id: leadID,
            };
          }
        }
      }

      req.stepTrackingData = {
        ...(req.stepTrackingData || {}),
        customerID: Number(customerID),
        leadID,
        stepID: Number(req.stepTrackingData?.stepID),
      };
      console.log("🔍 Response structure:", {
        statusCode,
        responseData,
        message,
      });

      return this.sendResponse(res, statusCode, responseData, message);
    } catch (error) {
      next(error);
    }
  };

  public verifyOfficeEmailOtp = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      let data = req.body;
      const validatorParams = {
        step: "required",
        office_email_id: "required | string",
        otp: "required | numeric | min:4 | max:4",
      };

      const validator = await CommonHelper.commonValidations(
        data,
        validatorParams,
      );

      if (validator && validator.length > 0) {
        const errorStatus = logger.error(validator);
        if (errorStatus) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Invalid Request Body",
            { ...validator },
            400,
          );
        } else {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Invalid Request Body",
            { errors: "Somthing issue in logger" },
            400,
          );
        }
      } else {
        let step = data.step;
        let customerID = req?.customer?.customerID;
        let mobile = req?.customer?.mobile;
        let otp = data.otp;
        let office_email_id = data.office_email_id;

        let customer = (await this.customerService.findOne(
          { customerID, mobile },
          ["customerID", "name"],
        )) as ICustomer;
        let customerApp = (await this.customerAppService.findOne(
          { customerID, mobile: mobile as unknown as bigint },
          ["*"],
        )) as ICustomerApp;

        let otp_in_db: string;

        function validateOtp(otp: any, otp_in_db: any) {
          if (otp !== otp_in_db) return false;
          else return true;
        }
        if (customer || step == "Repeat_Customer") {
          let employer = (await this.employerService.findOne(
            { office_email_id },
            ["office_email_otp"],
            [{ column: "employerID", order: "desc" }],
          )) as IEmployer;
          otp_in_db = employer?.office_email_otp;
          let isValidOtp = validateOtp(otp, otp_in_db);
          if (!isValidOtp) {
            return this.commonHelper.sendResponse(
              res,
              false,
              "Incorrect OTP.",
              {},
              401,
            );
          }
          await this.customerService.updateOne(
            { customerID },
            { official_email: office_email_id },
          );
          await this.employerService.updateOne(
            {
              office_email_otp: otp,
              customerID,
              office_email_id,
            },
            { is_verified_email: "Yes" },
          );
          return this.commonHelper.sendResponse(
            res,
            true,
            "OTP verification successful.",
            {},
            200,
          );
        } else if (customerApp) {
          let otp = (await this.customerAppService.findOne(
            { office_email_id },
            ["office_email_otp"],
          )) as ICustomerApp;
          otp_in_db = otp.office_email_otp;
          let isValidOtp = validateOtp(otp, otp_in_db);
          if (!isValidOtp) {
            return this.commonHelper.sendResponse(
              res,
              false,
              "Incorrect OTP.",
              {},
              401,
            );
          }
          await this.customerAppService.updateOne(
            { customerID },
            { official_email: office_email_id, is_verified_email: "Yes" },
          );
          return this.commonHelper.sendResponse(
            res,
            true,
            "OTP verification successful.",
            {},
            200,
          );
        } else {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Unauthorized user.",
            {},
            403,
          );
        }
      }
    } catch (error) {
      console.log(error);
      return this.commonHelper.sendResponse(
        res,
        false,
        "Internal Server Error",
        {},
        500,
      );
    }
  };

  public getCustomerEmiTransaction = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      let customerID = req.customer.customerID;
      let credit = (await this.creditService.findOne(
        { customerID, status: "disbursed" },
        ["creditID"],
      )) as ICredit;
      if (!credit) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Customer Not Found",
          {},
          400,
        );
      }
      let getTransections = await this.transectionService.findTransaction(
        { customerID: customerID, status: 2 },
        { orderKey: "customerID", orderValue: "desc" },
        ["amount", "status", "mode", "referenceNo", "createdAt"],
        ["collection", "panelty"],
      );

      return this.commonHelper.sendResponse(
        res,
        true,
        "Here is the list of all user transactions.",
        getTransections,
        200,
      );
    } catch (error) {
      console.log(error);
      this.commonHelper.sendResponse(
        res,
        false,
        "Internal Server Error",
        {},
        500,
      );
    }
  };

  public getAadharFromDigilocker = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      let customerID = req.customer.customerID;
      let customer = (await this.customerService.findOne({ customerID }, [
        "customerID",
      ])) as ICustomer;
      if (!customer) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Customer Not Found",
          {},
          400,
        );
      }
      const data = await verifyAadharWithDigilocker(
        Number(customer?.customerID),
      );
      return this.commonHelper.sendResponse(
        res,
        true,
        "Aadhar validation from digilocker.",
        { data },
        200,
      );
    } catch (error) {
      console.log(error);
      this.commonHelper.sendResponse(
        res,
        false,
        "Internal Server Error",
        {},
        500,
      );
    }
  };
  //digilockerRedirectUrl
  public digilockerRedirectUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { state, code } = req.query;

      if (
        !state ||
        !code ||
        typeof state !== "string" ||
        typeof code !== "string"
      ) {
        throw new Error(
          "Required query parameters are missing in digilockerRedirectUrl",
        );
      }
      const accessTokenData = await getAccessTokenDigilocker(state, code);
      if (
        accessTokenData.data.status === "SUCCESS" &&
        accessTokenData.data.responseKey === "success_access_token"
      ) {
        const referenceId = Date.now().toString();
        const url = config.decentro_eAadharApi;
        const initial_decentro_transaction_id = state;

        const Data = JSON.stringify({
          initial_decentro_transaction_id: initial_decentro_transaction_id,
          consent: true,
          consent_purpose: "For bank account purpose only",
          reference_id: String(referenceId),
          generate_xml: false,
          generate_pdf: true,
        });

        const response = await axios.post(url, Data, {
          headers: {
            client_id: config.decentro_client_id,
            client_secret: config.decentro_client_secret,
            module_secret: config.decentro_module_secret,
            "content-type": "application/json",
          },
          maxBodyLength: Infinity,
        });
        if (
          !response.data.data ||
          Object.keys(response.data.data).length === 0
        ) {
          throw new Error("User data not found in Digilocker.");
        }
        const { data } = response;
        return this.commonHelper.sendResponse(
          res,
          true,
          "user data after aadhar validation from Digilocker",
          { data },
          200,
        );
      } else {
        throw new Error("user not verified by digilocker");
      }
    } catch (error) {
      console.log("Error", error);
      throw new Error("Error while getting response from digilocker");
    }
  };

  public selfiVerify = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      let data = {
        mobile_no: +req.body.mobile_no,
        leadID: +req.body.leadID,
        aadhar_no: req.body.aadhar_no,
        step: req.body.step,
      };

      const validatorParams = {
        leadID: "required | numeric",
        aadhar_no: "required | string",
      };

      const validator = await CommonHelper.commonValidations(
        data,
        validatorParams,
      );
      if (validator && validator.length > 0) {
        const errorStatus = logger.error(validator);
        if (errorStatus) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Invalid Request Body",
            { ...validator },
            400,
          );
        } else {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Invalid Request Body",
            { errors: "Somthing issue in logger" },
            400,
          );
        }
      } else {
        let mobile = req.customer.mobile;
        let customerID = req.customer.customerID;
        let leadID = data.leadID;
        let aadharNo = data.aadhar_no;
        let file = req.file;
        if (!file) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Send Image",
            {},
            400,
          );
        }
        if (data.step) {
          await this.customerAppService.updateOne(
            { mobile },
            { step: data.step },
          );
        }
        let extension = path.extname(file?.originalname).toLowerCase();
        let image = "";
        let folder = "";
        if (await this.s3Service.isExtensionAllowed(extension)) {
          let imageName = `image_${Date.now()}${extension}`;
          let lead = (await this.leadService.findOne({ leadID, customerID }, [
            "customerID",
          ])) as ILead;
          if (!lead) {
            return this.commonHelper.sendResponse(
              res,
              false,
              "Wrong Lead Id",
              {},
              400,
            );
          }
          folder = `documents/kyc/${customerID}`;
          await this.s3Service.uploadDocument(file.buffer, folder, imageName);
          image = imageName;
        } else {
          return this.commonHelper.sendResponse(
            res,
            false,
            "File Extension Is Not Allowed",
            {},
            400,
          );
        }
        // get face livelyness of digitap
        let response = await this.digitapService.getFaceLiveness(
          mobile,
          leadID,
          image,
          aadharNo,
          folder,
        );
        // )) as {
        //   is_success: boolean
        //   apimsg: {
        //     error: string
        //     statusCode: string
        //     result: { is_same_face: boolean }
        //   }
        // }
        if (
          response &&
          response.is_success == true &&
          response?.apimsg?.result?.is_same_face
        ) {
          return this.commonHelper.sendResponse(
            res,
            true,
            "Successfully Matched",
            { ...response.apimsg },
            200,
          );
        } else if (
          response &&
          response.is_success == true &&
          !response?.apimsg?.result?.is_same_face
        ) {
          return this.commonHelper.sendResponse(
            res,
            false,
            `Not Matched`,
            { ...response.apimsg },
            400,
          );
        } else {
          return this.commonHelper.sendResponse(
            res,
            false,
            `Error From Digitap while selfie matching`,
            { ...response.apimsg },
            +response?.apimsg?.statusCode,
          );
        }
      }
    } catch (error) {
      console.log(error);
      return this.commonHelper.sendResponse(
        res,
        false,
        "Internal Server Error",
        {},
        500,
      );
    }
  };

  public getRepaymentPageData = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { leadId } = req.validatedBody as unknown as IRepaymentPagePayload;
      const { customerID } = req.customer ?? req.body.customer;

      const repaymentData = await this.emiCollectionService.getRepaymentData(
        leadId,
        Number(customerID),
      );

      return this.commonHelper.sendResponse(
        res,
        true,
        "All required data for repaymentPage",
        {
          amountToBeRepayed: repaymentData.amountToBeRepayed,
          loanSummary: repaymentData.loanSummary,
          getEmis: repaymentData.processedEmis,
          getTransections: repaymentData.getTransections,
          emiDocs: repaymentData.emiDocs,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return this.commonHelper.sendResponse(
        res,
        false,
        "Internal Server Error",
        {},
        500,
      );
    }
  };

  public customerLoginByMsg91 = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        mobile,
        app_id: appID,
        imei,
        plateform = "rulemudra",
      } = req.validatedBody as ICustomerLoginPayload;
      const { utm_source } = req.validatedQuery as IUtmSource;

      const payload: ICustomerLoginPayload = {
        mobile,
        app_id: appID,
        imei,
        utm_source,
        plateform,
      };

      const { data, message, statusCode } =
        await this.customerService.customerLoginByMsg91(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // new function for otp
  public createOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { mobile, req_id, otp, isVerified, created_at } =
        req.validatedBody as ICreateOTP;

      const payload: ICreateOTP = {
        mobile,
        req_id,
        otp,
        isVerified,
        created_at,
      };

      const { data, message, statusCode } =
        await this.customerService.createOtpService(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // new function for otp verify
  public verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { mobile, req_id, otp, isVerified, androidId, firebaseToken } =
        req.validatedBody as IVerifyOTP;

      const payload: IVerifyOTP = {
        mobile,
        req_id,
        otp,
        isVerified,
        androidId,
        firebaseToken,
      };

      const { data, message, statusCode } =
        await this.customerService.verifyOtpService(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public email_validation_bulk = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<object> => {
    try {
      const emailList = req.body.emailList;
      const responses = [];
      let apiResponse: IApiResponse;

      for (const email of emailList) {
        const customerApp = (await this.customerAppService.findOne({ email }, [
          "customerID",
          "email_delivery_status",
          "email_last_validation",
        ])) as ICustomerApp;
        if (!customerApp) {
          responses.push({
            email: email,
            deliveryStatus: "Customer Not Found",
          });
          continue;
        }
        const lastValidationDate = new Date(customerApp.email_last_validation);
        const differenceInMillis = Date.now() - lastValidationDate.getTime();
        const differenceInDays = Math.floor(
          differenceInMillis / (1000 * 60 * 60 * 24),
        );
        if (
          (customerApp.email_delivery_status === "deliverable" ||
            customerApp.email_delivery_status === "risky") &&
          differenceInDays < 365
        ) {
          responses.push({
            email: email,
            deliveryStatus: customerApp.email_delivery_status,
          });
        } else {
          apiResponse = (await validateEmailHelper(email)) as IApiResponse;
          let statusCode: number = 0;
          if (
            apiResponse.data.result?.valid &&
            (apiResponse.data.result.result === "deliverable" ||
              apiResponse.data.result.result === "risky")
          ) {
            const updateFields = {
              email_verification_status: statusCode,
              email_delivery_status: apiResponse.data.result.result,
              email_last_validation: apiResponse.data.updated_at.split("T")[0],
            };
            await this.customerAppModel.findOneAndUpdate(
              { email: email },
              updateFields,
            );
          }
          responses.push({
            email: email,
            deliveryStatus: apiResponse.data.result.result,
          });
        }
      }
      return res.json({ responses });
    } catch (error: any) {
      console.log("Error at email validation:", error.message);
      return this.commonHelper.sendResponse(
        res,
        false,
        "Error",
        { error: "Internal server error" },
        500,
      );
    }
  };

  dashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIp = this.commonHelper.getClientIp(req);

      const { data, message, statusCode } =
        await this.customerService.dashboard(req.customer, userIp);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public sending_bulk_user = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { data, message, statusCode } =
        await this.customerService.sendBulkUsers();

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  onePageView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { data, message, statusCode } =
        await this.customerService.onePageView(
          req.customer,
          req.validatedParams.loan_id,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  getCustomerAddress = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { data, message, statusCode } =
        await this.customerService.getCustomerAddress(
          Number(req?.customer?.user_id),
          req.customer.name,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  getFinboxAccountDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { data, message, statusCode } =
        await this.customerService.getFinboxAccount(
          Number(req?.customer?.customerID),
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // onePageReloan = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const {
  //       loan_required: loanRequeried,
  //       loan_purpose: loanPurpose,
  //       marrital,
  //       education,
  //       employeeType,
  //       modeOfPayment,
  //       company_name: companyName,
  //       industry,
  //       designation,
  //       monthly_income: monthlyIncome,
  //       salary_date,
  //       residenceType,
  //       city,
  //       landmark,
  //       pincode,
  //       residenceAddress,
  //       state,
  //       callBackUrl,
  //       plateform,
  //     } = req.body as ICustomerCheckDetails;

  //     const payload: ICustomerCheckDetails = {
  //       loan_purpose: loanPurpose,
  //       loan_required: loanRequeried,
  //       marrital,
  //       education,
  //       employeeType,
  //       modeOfPayment,
  //       company_name: companyName,
  //       industry,
  //       designation,
  //       monthly_income: monthlyIncome,
  //       salary_date,
  //       residenceType,
  //       city,
  //       landmark,
  //       pincode,
  //       residenceAddress,
  //       state,
  //       callBackUrl,
  //     };

  //     const { authorization } = req.headers;
  //     const token = authorization.split(" ")[1];

  //     const { data, message, statusCode } =
  //       await this.customerService.onePageReloan(
  //         req.customer,
  //         payload,
  //         this.commonHelper.getClientIp(req),
  //         token,
  //       );

  //     this.sendResponse(res, statusCode, data, message);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  razorpayPaydayRepayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let { leadId, razorpayOrderId, toValue } =
        req.validatedBody as IRazorpayPaydayRepayment;

      const payload: IRazorpayPaydayRepayment = {
        leadId,
        razorpayOrderId,
        toValue,
      };
      const { data, message, statusCode } =
        await this.collectionService.razorpayPaydayRepayment(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public getEmiSoa = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerID, leadID } = req.body as unknown as IEmiSoaPayload;
      const payload: IEmiSoaPayload = { customerID, leadID };
      const creditData = await this.creditModel.findOneCredit(
        { customerID, leadID },
        ["*"],
      );
      const loanData = await this.loanModel.findOneLoan(
        { leadID, customerID },
        ["*"],
      );

      if (!creditData) {
        throw new PreconditionError("No Active Emi Loan Found");
      }
      if (!loanData) {
        throw new PreconditionError("No loan Data found for this customer");
      }
      const customerData = await this.customerService.findOne({ customerID }, [
        "*",
      ]);
      const { data } = await this.collectionCrmService.getTransactions(payload);
      const repaymentData = await this.emiCollectionService.getRepaymentData(
        leadID,
        customerID,
      );

      this.sendResponse(
        res,
        200,
        {
          customer: customerData,
          loan: loanData,
          transections: data,
          loanSummary: repaymentData.loanSummary,
          getEmis: repaymentData.processedEmis,
          emiDocs: repaymentData.emiDocs,
        },
        "Data retrieved successfully.",
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  rekycButtonMessages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { data, message, statusCode } =
        await this.customerService.rekycButtonMessages(
          Number(req?.customer?.customerID),
          String(req.customer.mobile),
          req.customer.dob_digit_match_btn_click,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  panAadharMismatchUrlClick = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { data, message, statusCode } =
        await this.customerService.panAadharMismatchUrlClick(
          Number(req?.customer?.user_id),
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };
  public updateEMIPaymentVerification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const paymentDetails = req?.body;
      if (paymentDetails && paymentDetails.amount) {
        paymentDetails.amount = paymentDetails.amount / 100;
      }

      const payload = req?.body?.payload
        ? JSON.stringify(req.body.payload)
        : null;

      if (!paymentDetails) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Incorrect Body",
          {},
          400,
        );
      }

      const onlinePayment = await this.emiCollectionService.findOnlinePayment(
        paymentDetails.order_id,
      );
      // console.log('online payment', onlinePayment)
      if (!onlinePayment) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Payment not found",
          {},
          404,
        );
      }

      // await this.emiCollectionService.logPaymentUpdate(
      //   onlinePayment.pID,
      //   paymentDetails,
      //   payload,
      // )
      // console.log('------payment logs')
      await this.emiCollectionService.updatePaymentStatus(
        onlinePayment,
        paymentDetails,
      );

      const credit = await this.emiCollectionService.findCredit(
        +onlinePayment.leadID,
      );
      if (!credit) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Credit not found",
          {},
          400,
        );
      }
      const loan = await this.emiCollectionService.findLoan(credit.leadID);
      if (!loan) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "Loan not found",
          {},
          400,
        );
      }
      const transaction = (await this.transectionService.findOne(
        { orderId: paymentDetails.order_id, status: 1 },
        { orderKey: "id", orderValue: "desc" },
        ["*"],
      )) as ITransection;

      if (transaction) {
        return this.commonHelper.sendResponse(
          res,
          true,
          "Payment already  Update",
          {},
          200,
        );
      }
      let transID = await this.emiCollectionService.handleTransaction(
        paymentDetails,
        credit,
        loan,
        1,
      );
      paymentDetails.trans = {};
      if (paymentDetails.status === "captured") {
        paymentDetails.trans.order_id = paymentDetails.order_id;
        paymentDetails.trans.id = transID;
        await this.emiCollectionService.processManualPayment(
          paymentDetails,
          credit,
          loan,
        );
      }

      return this.commonHelper.sendResponse(
        res,
        true,
        "Payment Update",
        {},
        200,
      );
    } catch (error) {
      return this.commonHelper.sendResponse(
        res,
        true,
        "Internal Server Error",
        {},
        500,
      );
    }
  };

  public getCustomerName = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const name = req.customer.name;

      this.sendResponse(
        res,
        200,
        { name: `${name}`.trim() },
        "Customer name retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  public getUserTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerID } = req.customer;
      const { loan_id } = req.body;

      if (!customerID) {
        throw new BadRequestError("Customer info not found");
      }
      const getUserTransactionsResponse =
        await this.transectionService.findTransaction(
          { customerID },
          { orderKey: "id", orderValue: "desc" },
          ["*"],
          [],
        );
      this.sendResponse(
        res,
        200,
        getUserTransactionsResponse?.length ? getUserTransactionsResponse : [],
        "Transactions fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  };

  public getLoanHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.customer) {
        throw new BadRequestError("Customer info not found");
      }
      const { customerID } = req.customer;

      console.log(
        `[getLoanHistory] Fetching loan history for customerID: ${customerID}`,
      );

      const getLoanHistory = await this.loanService.findLoan({
        where: [
          { column: "customerID", value: Number(customerID) },
          { column: "status", value: LeadStatus.DISBURSED },
          { column: "payout_status", value: 2 },
        ],
        order: [{ column: "loanID", order: "desc" }],
        select: ["*"],
      });

      console.log(
        `[getLoanHistory] Found ${getLoanHistory.length} loans for customer ${customerID}`,
      );

      const loansWithDocuments = await Promise.all(
        getLoanHistory.map(async (loan: any) => {
          console.log(
            `[getLoanHistory] Processing loan ${loan.loanID} with leadID: ${loan.leadID}, customerID: ${loan.customerID}`,
          );
          const lead = await this.leadService.findOne({ leadID: loan.leadID }, [
            "status",
          ]);
          const documents = await this.getDocumentsForLoan(
            loan.customerID,
            loan.leadID,
          );
          console.log(
            `[getLoanHistory] Found ${documents.length} documents for loan ${loan.loanID}`,
          );
          return {
            ...loan,
            status: lead?.status || loan.status,
            documents,
          };
        }),
      );

      console.log(
        `[getLoanHistory] Successfully processed all loans with documents`,
      );

      this.sendResponse(
        res,
        200,
        loansWithDocuments,
        "Loan history fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  };

  private getDocumentsForLoan = async (
    customerID: number,
    leadID: number,
  ): Promise<any[]> => {
    try {
      const knex = getKnexInstance();

      const documents = await knex("document")
        .select("documentType", "documentFile")
        .where({ customerID, leadID })
        .whereIn("type", ["Sanction", "Agreement", "NOC"]);

      const documentsWithUrls = await Promise.all(
        documents.map(async (doc: any) => {
          const presignedUrl = await s3Service.getPresignedUrl(
            doc.documentFile,
          );
          return {
            documentType: doc.documentType,
            presignedUrl,
          };
        }),
      );

      return documentsWithUrls;
    } catch (error) {
      console.error("Error fetching documents for loan:", error);
      return [];
    }
  };

  createOrderRepayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let { leadId, amount } = req.validatedBody as IRazorpayRepayment;
      const payload: IRazorpayRepayment = {
        leadId,
        amount,
      };
      const { data, message, statusCode } =
        await this.collectionService.createOrderRepayment(payload);
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public repeatUserUpdateEmploymentDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        loan_required,
        loan_purpose,
        employeeType,
        modeOfPayment,
        company_name,
        monthly_income,
        salary_date,
      } = req.body as ICustomerCheckDetails;

      const payload: ICustomerCheckDetails = {
        loan_purpose,
        loan_required,
        employeeType,
        modeOfPayment,
        company_name,
        monthly_income,
        salary_date,
      };
      const userIp = this.commonHelper.getClientIp(req);
      const { customerID } = req.customer;
      const { data, message, statusCode } =
        await this.customerService.repeatUserUpdateEmploymentDetails(
          payload,
          req.customer,
          userIp,
        );
      req.stepTrackingData = {
        ...(req.stepTrackingData || {}),
        customerID: Number(customerID),
        leadID: (data as { loan_id: number }).loan_id,
        stepID: Number(req.stepTrackingData?.stepID),
      };
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public getExistingBankDetails = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { customerID } = req.customer;

      const loanData = await this.loanService.findLoan({
        where: [
          { column: "customerID", value: customerID },
          { column: "payout_status", value: 2 },
          { column: "status", value: "Disbursed" },
        ],
        order: [{ column: "loanID", order: "desc" }],
        select: [
          "accountNo",
          "bankIfsc",
          "bank",
          "accountType",
          "status",
          "loanID",
          "leadID",
        ],
      });

      if (!loanData || loanData.length === 0) {
        return this.sendResponse(
          res,
          404,
          null,
          "No disbursed loan found for this customer",
        );
      }

      const accountDetails = await this.customerAccountService.findOne(
        {
          accountNo: loanData[0].accountNo,
          status: BankAccountStatus.VERIFIED,
        },
        { orderKey: "accountID", orderValue: "desc" },
        ["bank_holder_name", "status"],
      );

      const getEmandateStatusResponse = await razorpayMandateModel.findOne({
        where: {
          customerID: customerID,
          accountNo: loanData[0].accountNo,
        },
        whereIn: [{ column: "status", value: ["paid", "issued"] }],
        select: ["status"],
        order: [{ column: "id", order: "desc" }],
      });
      console.log("getEmandateStatusResponse", getEmandateStatusResponse);

      const emandateFlag = getEmandateStatusResponse ? true : false;

      const bankDetails = {
        accountNo: loanData[0].accountNo,
        bankIfsc: loanData[0].bankIfsc,
        bank: loanData[0].bank,
        accountType: loanData[0].accountType,
        isVerified: emandateFlag,
        status: loanData[0].status,
        bank_holder_name: accountDetails?.bank_holder_name || "",
        account_status: accountDetails?.status,
      };

      return this.sendResponse(
        res,
        200,
        bankDetails,
        "Bank details from disbursed loan fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  };

  public getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { customerID } = req.customer;
      const customerInfo = await this.customerService.findOne({ customerID });
      if (!customerInfo) {
        return this.sendResponse(
          res,
          400,
          null,
          "Customer information not found",
        );
      }
      const knex = getKnexInstance();
      await knex.raw(
        "SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))",
      );
      const getSelfiImageResponse = await knex("document")
        .where("customerID", customerID)
        .andWhere("documentType", "Selfie")
        .orderBy("documentID", "desc")
        .select(["documentFile"])
        .first();

      let getPresignedUrl = "";
      if (getSelfiImageResponse?.documentFile) {
        getPresignedUrl = await this.s3Service.getPresignedUrl(
          getSelfiImageResponse.documentFile,
        );
      }

      const response = {
        name: customerInfo.name,
        mobile: customerInfo.mobile,
        email: customerInfo.email,
        profile_image: getPresignedUrl,
      };

      return this.sendResponse(
        res,
        200,
        response,
        "Profile information of the customer",
      );
    } catch (error) {
      next(error);
    }
  };

  public getRazorpayDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { customerID } = req.customer;
    const leadID = req.params.leadID;
    const customerInfo = await this.customerService.findOne({ customerID });
    if (!customerInfo) {
      return this.sendResponse(
        res,
        400,
        null,
        "Customer information not found",
      );
    }

    const razorpayDetails = await this.customerService.getRazorpayDetails(
      Number(customerID),
      Number(leadID),
    );
    if (!razorpayDetails) {
      return this.sendResponse(res, 400, null, "Razorpay details not found");
    }
    return this.sendResponse(
      res,
      razorpayDetails.statusCode,
      razorpayDetails.data,
      razorpayDetails.message,
    );
  };
}

export default CustomersController;
