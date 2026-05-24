import CommonController from "@/controllers/common.controller";
import CustomersController from "@/controllers/customers.controller";
import { StepName } from "@/enums/common.enum";
import { Products } from "@/enums/product.enum";
import { Routes } from "@/interfaces/routes.interface";
import Authentication from "@/middlewares/auth.middleware";
import { enableTracking } from "@/middlewares/enableTracking.middleware";
import Multer from "@/middlewares/multer.middleware";
import { stepCheck2 } from "@/middlewares/stepCheck2.middleware";
import { stepTrackerAfterResponse } from "@/middlewares/stepTrackerAfterResponse.middleware";
import validatePayload from "@/middlewares/validation.middleware";
import ExperianTestService from "@/thirdPartyIntegrations/experian/services/test-experian.service";
import { getBankDetailsSchema } from "@/validations/common.validator";
import {
  dashboardSchema,
  emiSoaSchema,
  getOnePageView,
  incompleteDetailsSchema,
  loginCustomerSchema,
  razorpayPaydayRepaymentSchema,
  razorpayRepaymentSchema,
  repaymentPageSchema,
  repeatCaseSchema,
  utmSourceSchema,
  verifyOtpSchema,
} from "@/validations/customer.validator";
import { Router } from "express";

class CustomerRoute implements Routes {
  public path = "/user";
  public router = Router();
  public authentication = new Authentication();
  public customersController = new CustomersController();
  public commonController = new CommonController();
  public experianTestService = new ExperianTestService();
  public multer = new Multer();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // ==========================================================
    // =======================ALL APIs USED BY RULE MUDRA========

    this.router.post(
      `${this.path}/otp/send`,
      validatePayload({ body: loginCustomerSchema, query: utmSourceSchema }),
      this.customersController.customerLoginByMsg91,
    );

    this.router.post(
      `${this.path}/otp/verify`,
      validatePayload({ body: verifyOtpSchema }),
      this.customersController.otp_verify,
    );

    this.router.post(
      `${this.path}/update-details`,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.EMPLOYMENT_DETAILS, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      validatePayload({ body: incompleteDetailsSchema }),
      this.customersController.incompleteDetailsUpdate,
    );

    this.router.post(
      `${this.path}/update-employment-details`,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.EMPLOYMENT_DETAILS, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      validatePayload({ body: repeatCaseSchema }),
      this.customersController.repeatUserUpdateEmploymentDetails,
    );

    // ==========================================================
    // =========================END OF NEW APIs LIST=============

    this.router.post(
      `${this.path}/experian-test/hard-pull`,
      this.experianTestService.hardPullExperian,
    );
    // this.router.post(
    //   `${this.path}/customer-login`,
    //   validatePayload({ body: loginCustomerSchema }),
    //   this.customersController.customerLogin,
    // );

    this.router.get(
      `${this.path}/aadhar/status`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.commonController.aadharStatus,
    );
    this.router.get(
      `/get-bank-name-by-ifsc`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ query: getBankDetailsSchema }),
      this.commonController.getBankDetails,
    );

    this.router.post(
      `${this.path}/razorpayPayment`,
      this.authentication.isAuthenticatedCustomer,
      this.customersController.razorpayPayment,
    );

    // this.router.post(
    //   `${this.path}/updateEMIPayment`,
    //   this.customersController.updateEMIPayment,
    // );

    // this.router.post(
    //   `${this.path}/updateEMIPaymentPayu`,
    //   this.customersController.updateEMIPaymentPayu,
    // );

    // this.router.post(
    //   `${this.path}/updateEMIPaymentPayuBiller`,
    //   this.customersController.updateEMIPaymentPayuBiller,
    // );

    this.router.post(
      `${this.path}/manage_payment_cron`,
      this.customersController.managePaymentCron,
    );

    // this.router.post(
    //   `${this.path}/updateEMIManualPayment`,
    //   this.authentication.isSisterService,
    //   this.customersController.updateEMIManualPayment,
    // );

    // this.router.post(
    //   `${this.path}/validate-email`,
    //   this.authentication.isSisterService,
    //   this.customersController.email_validation,
    // );

    // this.router.post(
    //   `${this.path}/truecallerLogin`,
    //   this.customersController.truecallerLogin,
    // );

    // this.router.post(
    //   `${this.path}/test`,
    //   // this.authentication.isAuthenticatedCustomer,
    //   //pagination,
    //   this.customersController.test,
    // );

    this.router.get(
      `${this.path}/getAadharFromDigilocker`,
      this.authentication.isAuthenticatedCustomer,
      this.customersController.getAadharFromDigilocker,
    );
    //Call backurl of digilocker[decentro]
    this.router.get(
      `${this.path}/digilocker_redirect_url`,
      this.customersController.digilockerRedirectUrl,
    );
    this.router.get(
      `${this.path}/getCustomerEmiTransaction`,
      this.authentication.isAuthenticatedCustomer,
      this.customersController.getCustomerEmiTransaction,
    );
    this.router.post(
      `${this.path}/getRepaymentPageData`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ body: repaymentPageSchema }),
      this.customersController.getRepaymentPageData,
    );

    this.router.post(
      `${this.path}/get-repayment-page-data`,
      this.authentication.isSisterService,
      validatePayload({ body: repaymentPageSchema }),
      this.customersController.getRepaymentPageData,
    );

    this.router.post(
      `${this.path}/selfiVerify`,
      this.authentication.isAuthenticatedCustomer,
      this.multer.SingleUpload,
      this.customersController.selfiVerify,
    );

    // this.router.post(
    //   `${this.path}/send-otp`,
    //   validatePayload({ body: loginCustomerSchema }),
    //   this.customersController.createOtp,
    // );

    // this.router.post(
    //   `${this.path}/verify-mobile-otp`,
    //   validatePayload({ body: verifyOtpPayload }),
    //   this.customersController.verifyOtp,
    // );

    // this.router.post(
    //   `${this.path}/validate-email-inBulk`,
    //   this.authentication.isSisterService,
    //   this.customersController.email_validation_bulk,
    // );

    // Dashboard
    this.router.post(
      `${this.path}/dashboard`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: dashboardSchema }),
      this.customersController.dashboard,
    );

    // this.router.post(
    //   `${this.path}/bulk-users`,
    //   this.customersController.sending_bulk_user,
    // );

    // one-page view
    this.router.get(
      `${this.path}/detail-confirm/:loan_id`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck2(StepName.LOAN_AMOUNT_CLOSED, Products.PAYDAY),
      validatePayload({ params: getOnePageView }),
      this.customersController.onePageView,
    );
    // Repeated case
    // this.router.post(
    //   `${this.path}/detail-confirm/:leadID`,
    //   this.authentication.isAuthenticatedCustomerByJWT,
    //   // stepCheck2(StepName.LOAN_AMOUNT_CLOSED, Products.PAYDAY),
    //   validatePayload({ body: repeatCaseSchema }),
    //   this.customersController.onePageReloan,
    // );

    this.router.get(
      `${this.path}/address`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customersController.getCustomerAddress,
    );

    this.router.get(
      `${this.path}/bank-details`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customersController.getFinboxAccountDetails,
    );
    this.router.post(
      `${this.path}/razorpay/razorpayPaydayRepayment`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: razorpayPaydayRepaymentSchema }),
      this.customersController.razorpayPaydayRepayment,
    );

    this.router.get(
      `${this.path}/rekyc/message`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customersController.rekycButtonMessages,
    );

    this.router.get(
      `${this.path}/kyc/mismatch`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customersController.panAadharMismatchUrlClick,
    );

    // customer EMI SOA
    this.router.post(
      `${this.path}/emi-soa`,
      this.authentication.isSisterService,
      validatePayload({ body: emiSoaSchema }),
      this.customersController.getEmiSoa,
    );
    this.router.post(
      `${this.path}/updateEMIPaymentVerification`,
      //this.authentication.isSisterService,
      this.customersController.updateEMIPaymentVerification,
    );

    // Get customer name from JWT

    this.router.get(
      `${this.path}/customer-name`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customersController.getCustomerName,
    );

    this.router.get(
      `${this.path}/transactions-history`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // validatePayload({ body: userTransactionsSchema }),
      this.customersController.getUserTransactions,
    );

    this.router.get(
      `${this.path}/loan-history`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customersController.getLoanHistory,
    );

    this.router.post(
      `${this.path}/repayment/create-order`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: razorpayRepaymentSchema }),
      this.customersController.createOrderRepayment,
    );

    this.router.get(
      `${this.path}/get-existing-bank-details`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customersController.getExistingBankDetails,
    );

    this.router.get(
      `${this.path}/profile`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customersController.getUserProfile,
    );

    this.router.get(
      `${this.path}/get-razorpay-details/:leadID`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customersController.getRazorpayDetails,
    );
  }
}

export default CustomerRoute;
