import CommonController from '@/controllers/common.controller'
import { Routes } from '@/interfaces/routes.interface'
import Authentication from '@/middlewares/auth.middleware'
import validatePayload from '@/middlewares/validation.middleware'
import {
  checkAndApplyWaiverSchema,
  customerDetailsSchema,
  experianBureauDetailsSchema,
  getBankDetailsSchema,
  ivrMenuOneSchema,
  ivrMenuTwoSchema,
  LeadStatusSchema,
  loanVerificationSchema,
} from '@/validations/common.validator'
import { Router } from 'express'

class CommonRoute implements Routes {
  public path = '/common'
  public router = Router()
  public commonController = new CommonController()
  private authentication = new Authentication()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    //IVR Menu 1
    // ! Refactored
    this.router.get(
      `${this.path}/ivrMenuOne`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ query: ivrMenuOneSchema }),
      this.commonController.ivrMenuOne,
    )
    //IVR Menu 2
    // ! Refactored
    this.router.post(
      `${this.path}/ivrMenuTwo`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ body: ivrMenuTwoSchema }),
      this.commonController.ivrMenuTwo,
    )
    //Customer Details
    // ! Refactored
    this.router.get(
      `${this.path}/customerDetails`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ query: customerDetailsSchema }),
      this.commonController.customerDetails,
    )

    // Get banks

    this.router.get(
      `${this.path}/bank-details`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ query: getBankDetailsSchema }),
      this.commonController.getBankDetails,
    )

    // aadhar-down api

    this.router.get(
      `${this.path}/aadhar-status`,
      this.authentication.isAuthenticatedCustomerByJWT,
      this.commonController.aadharStatus,
    )
    this.router.get(
      `${this.path}/disbursal-status`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ query: ivrMenuOneSchema }),
      this.commonController.disbursalStatus,
    )
    this.router.get(
      `${this.path}/repayment-status`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ query: ivrMenuOneSchema }),
      this.commonController.repaymentStatus,
    )
    this.router.get(
      `${this.path}/checkNumber`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ query: ivrMenuOneSchema }),
      this.commonController.checkNumber,
    )
    this.router.get(
      `${this.path}/verifyLoanNumber`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ query: loanVerificationSchema }),
      this.commonController.verifyLoanNumber,
    )
    this.router.get(
      `${this.path}/newLoanSms`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ query: ivrMenuOneSchema }),
      this.commonController.newLoanSms,
    )
    this.router.get(
      `${this.path}/repaymentLinkSms`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ query: ivrMenuOneSchema }),
      this.commonController.repaymentLinkSms,
    )

    this.router.get(
      `${this.path}/leadStatus`,
      this.authentication.authenticateAsferaRequest,
      validatePayload({ query: LeadStatusSchema }),
      this.commonController.leadStatus,
    )

    // this.router.post(
    //   `${this.path}/experian_fatch`,
    //   validatePayload({
    //     body: experianUserDetailsSchema,
    //   }),
    //   this.commonController.hardPullExperianDetails,
    // )

    // this.router.post(
    //   `${this.path}/experian_fatch_crm`,
    //   validatePayload({
    //     body: experianCrmDetailsSchema,
    //   }),
    //   this.commonController.hardPullExperianCrmDetails,
    // )
    this.router.post(
      `${this.path}/experian-fetch`,
      // this.authentication.basicAuthMiddleware,
      validatePayload({
        body: experianBureauDetailsSchema,
      }),
      this.commonController.hardPullExperianBureauDetails,
    )

    this.router.post(
      `${this.path}/check-and-apply-payday-waiver`,
      this.authentication.isSisterService,
      validatePayload({
        body: checkAndApplyWaiverSchema,
      }),
      this.commonController.checkAndApplyTemporaryWaiver,
    )
  }
}

export default CommonRoute
