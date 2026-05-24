import IndexRoute from '@/routes/index.route'
import ReportSummaryRoute from '@/routes/reportSummary.route'
import CibilScoreRoute from './cibilscore.route'
import CommonRoute from './common.route'
import CRMRoute from './crm.route'
import CustomerRoute from './customer.route'
import CustomerBankAccountRoute from './customerBankAccount.route'
import LogsRoute from './logs.routes'
import CustomerOnboardingRoute from './onboarding.routes'
import PageInstructionRoute from './pageInstruction.route'
import StepRoute from './step.route'
import RazorPayRoute from './webhooks.routes'
import CollectionCrmRoute from './collectionCrm.route'
import SoaRoute from './soa.route'
import LenderRoute from './lender.route'

export const routes = [
  new IndexRoute(),
  new ReportSummaryRoute(),
  new CustomerRoute(),
  new CRMRoute(),
  new CibilScoreRoute(),
  new LogsRoute(),
  new CommonRoute(),
  new CustomerOnboardingRoute(),
  new PageInstructionRoute(),
  new RazorPayRoute(),
  new CustomerBankAccountRoute(),
  new StepRoute(),
  new CollectionCrmRoute(),
  new SoaRoute,
  new LenderRoute
]
