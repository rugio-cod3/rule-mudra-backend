import CibilScoreController from '@/controllers/cibilscore.controller'
import { Routes } from '@/interfaces/routes.interface'
import Authentication from '@/middlewares/auth.middleware'
import pagination from '@/middlewares/pagination'
import validatePayload from '@/middlewares/validation.middleware'
import {
  accountDetailsSchema,
  answerQuestionSchema,
  getPaymentStatusSchema,
  reportSummarySchema,
  updateJourneysSchema,
  viewImpactSchema,
} from '@/validations/cibilscore.validator'
import { Router } from 'express'

class CibilScoreRoute implements Routes {
  public path = '/cibilscore'
  public router = Router()
  public authentication = new Authentication()
  public cibilScoreController = new CibilScoreController()

  constructor() {
    this.initializeRoutes()
  }
  private initializeRoutes() {
    // ! Refactored
    this.router.get(
      `${this.path}/getTermsAndConditions`,
      this.authentication.isAuthenticatedCustomer,
      this.cibilScoreController.getTermsAndConditions,
    )
    // ! Refactored
    this.router.post(
      `${this.path}/updateJourneys`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ body: updateJourneysSchema }),
      this.cibilScoreController.updateJourneys,
    )
    // ! Refactored
    this.router.post(
      `${this.path}/createCheckout`,
      this.authentication.isAuthenticatedCustomer,
      this.cibilScoreController.createCheckout,
    )
    this.router.post(
      `${this.path}/subscriptionRazorpayWebhook`,
      this.cibilScoreController.subscriptionRazorpayWebhook,
    )
    // ! Refactored
    this.router.get(
      `${this.path}/getPaymentStatus`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ query: getPaymentStatusSchema }),
      this.cibilScoreController.getPaymentStatus,
    )
    // ! Refactored
    this.router.get(
      `${this.path}/experianPull`,
      this.authentication.isAuthenticatedCustomer,
      this.cibilScoreController.experianPull,
    )
    // ! Refactored
    this.router.post(
      `${this.path}/answerQuestion`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ body: answerQuestionSchema }),
      this.cibilScoreController.answerQuestion,
    )
    // ! Refactored
    this.router.post(
      `${this.path}/paymentCheckout`,
      this.authentication.isAuthenticatedCustomer,
      this.cibilScoreController.paymentCheckout,
    )
    // ! Refactored
    this.router.post(
      `${this.path}/updateSubscriptionPayment`,
      this.cibilScoreController.updateSubscriptionPayment,
    )
    // ! Refactored
    this.router.get(
      `${this.path}/getJourneyStep`,
      this.authentication.isAuthenticatedCustomer,
      this.cibilScoreController.getJourneyStep,
    )
    // ! Refactored
    this.router.get(
      `${this.path}/getSubscription`,
      pagination,
      this.cibilScoreController.getSubscription,
    )
    // ! Refactored
    this.router.get(
      `${this.path}/getSubscriptionPayments`,
      this.cibilScoreController.getSubscriptionPayments,
    )
    // ! Refactored
    this.router.get(
      `${this.path}/getSubscriptionProcess`,
      this.cibilScoreController.getSubscriptionProcess,
    )
    // TODO : To Refactor
    this.router.post(
      `${this.path}/status`,
      //creditReportMiddleware,
      this.cibilScoreController.cibilReportStatus,
    )
    // TODO : To Refactor
    this.router.post(
      `${this.path}/customer-assets`,
      //creditReportMiddleware,
      this.cibilScoreController.customerAssets,
    )
    // TODO : To Refactor
    this.router.post(
      `${this.path}/creditReportAuthVerification`,
      //creditReportMiddleware,
      this.cibilScoreController.creditReportAuthVerification,
    )
    // TODO : To Refactor
    this.router.post(
      `${this.path}/creditReportViewLink`,
      //creditReportMiddleware,
      this.cibilScoreController.creditReportViewLink,
    )
    this.router.get(
      `${this.path}/report-summary`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ query: reportSummarySchema }),
      this.cibilScoreController.reportSummary,
    )
    this.router.get(
      `${this.path}/account-details`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ query: accountDetailsSchema }),
      this.cibilScoreController.accountDetails,
    )
    this.router.get(
      `${this.path}/view-impact`,
      this.authentication.isAuthenticatedCustomer,
      validatePayload({ query: viewImpactSchema }),
      this.cibilScoreController.viewImpact,
    )
    this.router.post(
      `${this.path}/fetchRazorpayOrder`,
      this.authentication.isAuthenticatedCustomer,
      //validatePayload({ query: fetchOrderDetailsSchema }),
      this.cibilScoreController.fetchRazorpayOrder,
    )
    this.router.post(
      `${this.path}/cancel-experian-subscription`,
      this.cibilScoreController.cancelExperianSubscription,
    )
  }
}
export default CibilScoreRoute
