import CustomerOnboardingController from "@/controllers/onboarding.controller";
import { StepName } from "@/enums/common.enum";
import { Products } from "@/enums/product.enum";
import { Routes } from "@/interfaces/routes.interface";
import Authentication from "@/middlewares/auth.middleware";
import Multer from "@/middlewares/multer.middleware";
import pagination from "@/middlewares/pagination";
import { stepCheck2 } from "@/middlewares/stepCheck2.middleware";
import validatePayload from "@/middlewares/validation.middleware";
import { saveBankDetailsSchema } from "@/validations/customerBankAccount.validator";
import {
  aadharVerificationGenerateOtpSchema,
  aadharVerificationVerifyOtpSchema,
  approvalViewSchema,
  digitalEsignReportSchema,
  digitalEsignSchema,
  emandateSchema,
  finboxBankConnectSchema,
  finboxCreateUrlSchema,
  getStatesSchema,
  keyFactSchema,
  loanApprovalSchema,
  NameAndEmailOnboardingSchema,
  panConfirmationSchema,
  panVerificationSchema,
  pennyDropInitiateSchema,
  referenceDetailsSchema,
  updateReferenceDetailsSchema,
} from "@/validations/onboarding.validator";
import { Router } from "express";
import { enableTracking } from "../middlewares/enableTracking.middleware";
import { stepTrackerAfterResponse } from "../middlewares/stepTrackerAfterResponse.middleware";
class CustomerOnboardingRoute implements Routes {
  public path = "/user";
  public loanPath = "/loan";
  public router = Router();
  public authentication = new Authentication();
  public customerOnboardingController = new CustomerOnboardingController();
  public multer = new Multer();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    // ==========================================================
    // =======================ALL APIs USED BY RULE MUDRA========

    this.router.post(
      `${this.path}/basic-detail`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck2(StepName.BASIC_DETAIL, Products.PAYDAY),
      // stepTrackerAfterResponse,
      // enableTracking,
      validatePayload({ body: NameAndEmailOnboardingSchema }),
      this.customerOnboardingController.onboardPanVerification,
    );

    this.router.post(
      `${this.path}/pan/verify`,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.PAN_CONFIRMATION, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      validatePayload({ body: panConfirmationSchema }),
      this.customerOnboardingController.onboardPanConfirmation,
    );

    this.router.post(
      `${this.path}/aadhar-verification/initiate/digilocker`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customerOnboardingController
        .aadharVerificationInitiateDigiLockerSurepass,
    );
    this.router.get(
      `${this.path}/aadhar-verification/webhook/digilocker`,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.AADHAR_CONFIRMATION, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      this.customerOnboardingController.aadharVerificationWebhookDigiLocker,
    );

    this.router.post(
      `${this.path}/loan/approval`,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.LOAN_APPROVAL, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      validatePayload({ body: loanApprovalSchema }),
      this.customerOnboardingController.loanApproval,
    );

    // Repeat case
    this.router.post(
      `${this.loanPath}/approval`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: approvalViewSchema }),
      this.customerOnboardingController.approvalView,
    );

    this.router.post(
      `${this.path}/bank-connect`,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.LOAN_APPROVAL, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      validatePayload({ body: finboxBankConnectSchema }),
      this.customerOnboardingController.finboxBankConnect,
    );

    this.router.post(
      `${this.path}/selfie-verify`,
      this.multer.SingleUpload,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.SELFIE_VERIFICATION, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      this.customerOnboardingController.verifySelfie,
    );

    this.router.post(
      `${this.loanPath}/penny-drop`,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.PENNY_DROP, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      validatePayload({ body: pennyDropInitiateSchema }),
      this.customerOnboardingController.pennyDrop,
    );

    this.router.post(
      `${this.loanPath}/e-mandate`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck2(StepName.EMANDATE, Products.PAYDAY),
      // enableTracking(),
      // stepTrackerAfterResponse,
      validatePayload({ body: emandateSchema }),
      this.customerOnboardingController.setEmandateV2,
    );

    // Reference Details
    this.router.post(
      `${this.path}/reference`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck(StepName.REFERENCE_DETAILS, Products.PAYDAY),
      stepCheck2(StepName.REFERENCE_DETAILS, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      validatePayload({ body: referenceDetailsSchema }),
      this.customerOnboardingController.addReferenceDetails,
    );

    this.router.post(
      `${this.loanPath}/key-fact-statement`,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.KFS, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      validatePayload({ body: keyFactSchema }),
      this.customerOnboardingController.keyFactsAcceptance,
    );

    this.router.post(
      `${this.path}/bank-verify`,
      this.authentication.isAuthenticatedCustomerByJWT,
      stepCheck2(StepName.PENNY_DROP, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      // validatePayload({ body: bankVerifySchema }),
      this.customerOnboardingController.bankVerify,
    );

    this.router.post(
      `${this.path}/confirm-bank-details`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: saveBankDetailsSchema }),
      stepCheck2(StepName.BANK_ACCOUNT_CONFIRMATION, Products.PAYDAY),
      enableTracking(),
      stepTrackerAfterResponse,
      this.customerOnboardingController.confirmBankDetails,
    );

    // ==========================================================
    // =========================END OF NEW APIs LIST=============

    this.router.post(
      `${this.path}/aadhar/send-otp`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck(StepName.AADHAR_CONFIRMATION, Products.PAYDAY),
      // stepCheck2(StepName.AADHAR_CONFIRMATION, Products.PAYDAY),
      validatePayload({ body: aadharVerificationGenerateOtpSchema }),
      this.customerOnboardingController.aadharVerificationGenerateOtp,
    );
    this.router.post(
      `${this.path}/aadhar/verify-otp`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck(StepName.AADHAR_CONFIRMATION, Products.PAYDAY),
      // stepCheck2(StepName.AADHAR_CONFIRMATION, Products.PAYDAY),
      validatePayload({ body: aadharVerificationVerifyOtpSchema }),
      this.customerOnboardingController.aadharVerificationVerifyOtp,
    );
    // const logMiddleware = (name: string) => (req, res, next) => {
    //   console.log(`[MIDDLEWARE START] ${name}`);
    //   next();
    // };

    this.router.get(
      `${this.path}/kyc/verify`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck(StepName.AADHAR_CONFIRMATION, Products.PAYDAY),
      // stepCheck2(StepName.AADHAR_CONFIRMATION, Products.PAYDAY),
      this.customerOnboardingController.aadharPanVerifyMatch,
    );

    this.router.get(
      `${this.path}/kyc/reverify`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck(StepName.AADHAR_CONFIRMATION, Products.PAYDAY),
      // stepCheck2(StepName.AADHAR_CONFIRMATION, Products.PAYDAY),
      this.customerOnboardingController.aadharPanReverify,
    );

    this.router.post(
      `${this.path}/pan-details`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck(StepName.PAN_CONFIRMATION, Products.PAYDAY),
      // stepCheck2(StepName.PAN_CONFIRMATION, Products.PAYDAY),
      validatePayload({ body: panConfirmationSchema }),
      this.customerOnboardingController.onboardPanFetch,
    );

    this.router.put(
      `${this.path}/update_customer_details`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customerOnboardingController.update_customer_details,
    );
    this.router.post(
      `${this.path}/save_bank_details`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customerOnboardingController.saveBankDetails,
    );

    // Finbox

    this.router.post(
      `${this.path}/connect-url`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck2(StepName.FINBOX, Products.PAYDAY),
      validatePayload({ body: finboxCreateUrlSchema }),
      this.customerOnboardingController.finboxCreateUrl,
    );

    // this.router.post(
    //   `${this.path}/dashboard`,
    //   this.authentication.isAuthenticatedCustomerByJWT,
    //   validatePayload({ body: dashBoardSchema }),
    //   this.customerOnboardingController.dashboard
    // );

    // Penny drop - 1
    // TODO : TEST

    // emandate

    this.router.post(
      `${this.path}/set-emandate`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck2(StepName.EMANDATE, Products.PAYDAY),
      validatePayload({ body: emandateSchema }),
      this.customerOnboardingController.setEmandate,
    );

    this.router.post(
      `${this.path}/set-verify-emandate`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck2(StepName.EMANDATE, Products.PAYDAY),
      validatePayload({ body: emandateSchema }),
      this.customerOnboardingController.setVerifyEmandate,
    );

    // new emandate callback flow

    this.router.post(
      `${this.path}/set-verify-emandatev2`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck2(StepName.EMANDATE, Products.PAYDAY),
      validatePayload({ body: emandateSchema }),
      this.customerOnboardingController.setVerifyEmandateV2,
    );

    // Exclusive callbackUrl for razorpay-emandate payments
    this.router.post(
      `${this.path}/fetch-emandate-invoice`,
      // this.authentication.isAuthenticatedCustomer,
      // stepCheck2(StepName.EMANDATE, Products.PAYDAY),
      this.customerOnboardingController.fetchEmandateInvoice,
    );

    this.router.get(
      `${this.path}/reference`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck(StepName.REFERENCE_DETAILS, Products.PAYDAY),
      // stepCheck2(StepName.REFERENCE_DETAILS, Products.PAYDAY),
      pagination,
      this.customerOnboardingController.getReferenceDetails,
    );

    this.router.put(
      `${this.path}/reference`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck(StepName.REFERENCE_DETAILS, Products.PAYDAY),
      // stepCheck2(StepName.REFERENCE_DETAILS, Products.PAYDAY),
      validatePayload({ body: updateReferenceDetailsSchema }),
      this.customerOnboardingController.updateReferenceDetails,
    );
    this.router.get(
      "getstates",
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ query: getStatesSchema }),
      this.customerOnboardingController.getStates,
    );

    // Approval screen

    this.router.get(
      `${this.loanPath}/key-fact-statement`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ query: keyFactSchema }),
      // stepCheck2(StepName.KFS, Products.PAYDAY),
      this.customerOnboardingController.generatePaydayKfs,
    );

    this.router.post(
      `${this.path}/bre`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: keyFactSchema }),
      this.customerOnboardingController.bankingSurrogate,
    );
    this.router.post(
      `${this.path}/pan-verification-digitap`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ body: panVerificationSchema }),
      this.customerOnboardingController.onboardPanVerificationByDigitap,
    );

    //=====================> Loan Approval

    this.router.get(
      `${this.path}/dashboard`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customerOnboardingController.dashboard,
    );

    this.router.post(
      `${this.path}/digital-esign`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: digitalEsignSchema }),
      this.customerOnboardingController.digitalEsign,
    );

    this.router.post(
      `${this.path}/digital-esign/report`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: digitalEsignReportSchema }),
      this.customerOnboardingController.digitalEsignReport,
    );

    this.router.post(
      `${this.path}/test-finbox`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.customerOnboardingController.dashboard,
    );

    this.router.get(
      `${this.path}/reprocess-rejected-customers`,
      // this.authentication.isAuthenticatedCustomerByJWT,
      this.customerOnboardingController.reprocessRejectedCustomers,
    );
  }
}
export default CustomerOnboardingRoute;
