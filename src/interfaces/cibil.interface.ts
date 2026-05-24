import { PaymentCheckoutStatus } from '@/enums/cibil.enum'
import { ParsedQs } from 'qs'
import { IPagination } from './common.interface'
import { TSelectCreditScoreUserJourney } from './credit_socore_user_journey.interface'

export interface IGetTermsAndConditionsPayload {
  customerID: number
}

export interface IUpdateJourneysPayload {
  step: number
  customerID: number
}

export interface ICreateCheckoutPayload {
  customerID: number
  name: string
  email: string
  mobile: number
}

export interface IGetPaymentStatusPayload {
  subscriptionid: string
}

export interface IExperianPullPayload {
  token: string
  customerId: number
  name:string
}

export interface IAnswerQuestionPayload {
  access_token: string
  stgOneHitId: number
  stgTwoHitId: number
  questionId: number
  answer1: string
  answer2: string
  customerId?: number
}

export interface IPaymentCheckoutPayload {
  customerID: number
}

export interface IGetJourneyStep {
  customerID: number
}

export interface IGetSubscriptionPayload extends IPagination {
  status: PaymentCheckoutStatus
  subscriptionID: number
  customerID: number
  sort: string
}

export interface IGetSubscriptionPayments extends IPagination {
  status: PaymentCheckoutStatus
  subscriptionId: number
  customerID: number
  id: number
  orderId: string
  paymentId: string
  sort: string
}

export interface IGetSubscriptionPayments extends IPagination {
  status: PaymentCheckoutStatus
  subscriptionId: number
  customerID: number
  id: number
  orderId: string
  paymentId: string
  sort: string
}

export interface IGetSubscriptionProcess extends IPagination {
  step: number
  customerID: number
  id: number
  sortOn: TSelectCreditScoreUserJourney
  sort: string
}
export interface ICreditReportData {
  utilization_percent: string;
  tot_credit_limit: string;
  credit_age: number;
  active_accounts: string;
  closed_accounts: string;
  tot_enquiry: number;
  credit_card_enquiry: number;
  loan_enquiry: number;
  payment_percentage: string;
  delay_payment_count: number;
  score: number;
  monthwise_score: string;
  last_pull_date: string;
}

interface ImpactDetails {
  status: string;
  totalCreditLimit?: number;
  latePaymentsCount?: string;
  limitUtilisation?: number;
  usedLimit?: number;
  activeAccounts?: number;
  ageOfAccounts?: string;
  closedAccounts?: number;
  enquiriesForLoans?: number;
  creditCardEnquiries?: number;
  percentOnTime?:number
}

// Interface for whatChanged array items
interface WhatChangedItem {
  id: string;
  icon: string;
  name: string;
  value: number | string;
  impact: string;
  ontime: boolean;
  remark: string;
  impacts: ImpactDetails;
  message: string;
}

// Interface for current score details
interface CurrentScore {
  customerName:string;
  color: string;
  score: number;
  status: string;
  lastPullDate: string;
}

// Interface for individual monthly score
interface MonthlyScore {
  month: string;
  score: number;
}

// Interface for the full experian report data structure
export interface IExperianReportData {
  experian: {
      whatChanged: WhatChangedItem[];
      currentScore: CurrentScore;
      monthlyScores: MonthlyScore[];
  };
}
export interface IReportSummaryPayload{
  provider: string
  customerID: number
}
export interface IAccountDetailsPayload{
  accountId: number
  customerID: number
}
export interface IViewImpactPayload{
  impactId: number
  customerID: number
}

export interface IAccount {
  customerID: number;
  account_no: string;
  closing_date: Date | null;
  opening_date: Date;
  last_payment: Date | null;
  bank_name: string;
  loan_amount: number;
  credit_limit: number | null;
  current_balance: number;
  account_type: number;
  account_status: number;
  on_time_payments: number;
  due_date_payments: number;
}
export interface IfecthOrderDetailsPayload{
  customerId: number
}

