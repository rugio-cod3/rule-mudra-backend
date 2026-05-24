import CRMController from '@/controllers/crm.controller'
import { Routes } from '@/interfaces/routes.interface'
import Authentication from '@/middlewares/auth.middleware'
import Multer from '@/middlewares/multer.middleware'
import validatePayload from '@/middlewares/validation.middleware'
import {
  applyPenaltyPayloadSchema,
  BulkMandateSchema,
  creditDetailsPayload,
  emiCalculatorSchema,
  fileUploadSchema,
  generateEMISchema,
  getAmountToBeDisbursedPayload,
  getDocsRequirementsSchema,
  getEmiLoanDetailsSchema,
  leadUpdateSchema,
  paydayToEmiConversionSchema,
  paymentVerificationSchema,
  payuPaymentVerificationSchema,
  updatePaymentSchema,
  UrlBulkMandateSchema,
} from '@/validations/crm.validator'
import { Router } from 'express'

class CRMRoute implements Routes {
  public path = '/crm'
  public router = Router()
  public crmController = new CRMController()
  public authentication = new Authentication()
  private multer = new Multer()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    //TO UPDATE LEAD
    // ! Refactored
    this.router.put(
      `${this.path}/lead-update`,
      validatePayload({ body: leadUpdateSchema }),
      this.crmController.leadUpdate,
    )
    //TO CALCULATE EMI
    // ! Refactored

    this.router.get(
      `${this.path}/emiCalculator`,
      validatePayload({ query: emiCalculatorSchema }),
      this.crmController.emiCalculator,
    )
    //TO SAVE CREDIT DETAILS FROM DASHBOARD
    // ! Refactored

    this.router.post(
      `${this.path}/creditDetails`,
      validatePayload({ body: creditDetailsPayload }),
      this.crmController.creditDetails,
    )
    // ! Refactored

    this.router.get(
      `${this.path}/getAmountToDisbursed`,
      validatePayload({ query: getAmountToBeDisbursedPayload }),
      this.crmController.getAmountToDisbursed,
    )
    //TO GENERATE EMI INTO DB
    // ! Refactored

    this.router.post(
      `${this.path}/genrateEMI`,
      validatePayload({ body: generateEMISchema }),
      this.crmController.genrateEMI,
    )
    //TO UPDATE PAYMENTS BY ANOTHER CHANNELS
    // ! Refactored
    this.router.post(
      `${this.path}/updatePayment`,
      validatePayload({ body: updatePaymentSchema }),
      this.crmController.updatePayment,
    )
    //TO APPLY PANELTY

    // ! Refactored
    this.router.post(
      `${this.path}/applyPanelty`,
      validatePayload({ body: applyPenaltyPayloadSchema }),
      this.crmController.applyPanelty,
    )
    //GET EMI
    // ! Refactored
    this.router.get(
      `${this.path}/getEmis`,
      this.authentication.isAuthenticatedCustomer,
      this.crmController.getEmis,
    )

    // ! Refactored
    this.router.get(
      `${this.path}/getDocsRequirements`,
      this.authentication.isSisterService,
      validatePayload({ query: getDocsRequirementsSchema }),
      this.crmController.getDocsRequirements,
    )

    // ! Refactored
    this.router.get(
      `${this.path}/getEmiLoanDetails`,
      this.authentication.isSisterService,
      validatePayload({ query: getEmiLoanDetailsSchema }),
      this.crmController.getEmiLoanDetails,
    )
    this.router.post(
      `${this.path}/paydayToEmiConversion`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ body: paydayToEmiConversionSchema }),
      this.crmController.paydayToEmiConversion,
    )
    this.router.post(
      `${this.path}/uploadBulkMandateFile`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.multer.SingleUpload,
      validatePayload({ body: fileUploadSchema }),
      this.crmController.uploadBulkMandateFile,
    )
    this.router.get(
      `${this.path}/getBulkMandateData`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ query: BulkMandateSchema }),
      this.crmController.getBulkMandateData,
    )
    this.router.get(
      `${this.path}/getUrlforBulkMandateFile`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ query: UrlBulkMandateSchema }),
      this.crmController.getUrlforBulkMandateFile,
    )
    this.router.post(
      `${this.path}/paydayToEmiConversionTest`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ body: paydayToEmiConversionSchema }),
      this.crmController.paydayToEmiConversionTest,
    )
    this.router.get(
      `${this.path}/razorpayPaymentVerification`,
      // this.authentication.isAuthenticatedCustomer,
      validatePayload({ query: paymentVerificationSchema }),
      this.crmController.razorpayPaymentVerification,
    )
    this.router.get(
      `${this.path}/payUPaymentVerification`,
      // this.authentication.isAuthenticatedCustomer,
      validatePayload({ query: payuPaymentVerificationSchema }),
      this.crmController.payUPaymentVerification,
    )

    this.router.get(
      `${this.path}/payUPaymentVerificationPending`,
      // this.authentication.isAuthenticatedCustomer,
      this.crmController.payUPaymentVerificationPending,
    )
  }
}

export default CRMRoute
