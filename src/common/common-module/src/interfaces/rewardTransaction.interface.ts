/**
 * Reward Transaction Interfaces
 * Purpose: Type definitions for the withdrawal system
 */

export interface IRewardTransaction {
  id?: number
  customer_id: number
  transaction_id?: string // Auto-generated if not provided
  transaction_type: 'CREDIT' | 'DEBIT' | 'WITHDRAWAL'
  amount: number
  tds_amount?: number
  net_amount: number
  bank_account_id?: number
  payment_gateway?: 'RAZORPAY' | 'PAYU'
  gateway_reference_id?: string
  gateway_response?: any // JSON object
  description?: string
  status: TransactionStatus
  failure_reason?: string
  metadata?: any // JSON object
  created_at?: Date
  updated_at?: Date
  processed_at?: Date
  // webhook_received_at?: Date
}

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
export type TransactionType = 'CREDIT' | 'DEBIT' | 'WITHDRAWAL'
export type PaymentGateway = 'RAZORPAY' | 'PAYU'

export type TSelectRewardTransaction = keyof IRewardTransaction

// Withdrawal Request Interfaces
export interface IWithdrawalRequest {
  amount: number
  bank_account_id: number
  payment_gateway?: PaymentGateway
}

export interface IWithdrawalResponse {
  success: boolean
  data?: {
    transaction_id: string
    gross_amount: number
    tds_amount: number
    net_amount: number
    status: TransactionStatus
    estimated_completion?: string
  }
  error?: {
    code: string
    message: string
    details?: any
  }
}

// Eligibility Check Interfaces
export interface IWithdrawalEligibility {
  is_eligible: boolean
  redeemable_balance: number
  minimum_amount: number
  waiting_period_status: {
    completed: boolean
    remaining_days: number
  }
  bank_account_verified: boolean
  next_withdrawal_date?: string
  reasons?: string[] // Reasons for ineligibility
}

export interface IEligibilityCheckResponse {
  success: boolean
  data?: IWithdrawalEligibility
  error?: {
    code: string
    message: string
  }
}

// Transaction History Interfaces
export interface ITransactionHistoryItem {
  transaction_id: string
  transaction_type: TransactionType
  amount: number
  net_amount: number
  status: TransactionStatus
  gateway_reference_id?: string
  description?: string
  created_at: string
  processed_at?: string
  failure_reason?: string
}

export interface ITransactionHistoryResponse {
  success: boolean
  data?: {
    transactions: ITransactionHistoryItem[]
    pagination: {
      current_page: number
      total_pages: number
      total_records: number
      per_page: number
    }
    summary: {
      total_withdrawn: number
      total_pending: number
      total_failed: number
    }
  }
  error?: {
    code: string
    message: string
  }
}

// Balance Calculation Interface
export interface IBalanceCalculation {
  total_credits: number
  total_debits: number
  total_withdrawals: number
  pending_withdrawals: number
  redeemable_balance: number
  last_transaction_date?: string
}

// Referral Integration Interfaces
export interface IReferralEarning {
  referral_id: number
  referrer_customer_id: number
  referee_customer_id: number
  loan_disbursal_date: Date
  bonus_amount: number
  waiting_period_days: number
  is_eligible_for_withdrawal: boolean
  eligible_from_date?: Date
}

// Payment Gateway Interfaces
export interface IGatewayContact {
  id: string
  name: string
  email: string
  contact: string
  type: string
  reference_id: string
  active: boolean
  created_at: number
}

export interface IGatewayFundAccount {
  id: string
  entity: string
  contact_id: string
  account_type: string
  bank_account: {
    ifsc: string
    bank_name: string
    name: string
    account_number: string
  }
  active: boolean
  created_at: number
}

export interface IGatewayPayoutRequest {
  account_number: string
  fund_account: {
    id: string
  }
  amount: number // Amount in paise for Razorpay
  currency: string
  mode: string
  purpose: string
  reference_id: string
  notes: {
    transaction_id: string
    customer_id: string
  }
}

export interface IGatewayPayoutResponse {
  id: string
  entity: string
  fund_account_id: string
  amount: number
  currency: string
  fees: number
  tax: number
  status: string
  utr?: string
  mode: string
  purpose: string
  reference_id: string
  narration: string
  created_at: number
  error?: {
    code: string
    description: string
    source: string
    step: string
    reason: string
  }
}

// Configuration Interfaces
export interface IWithdrawalConfig {
  waiting_days: number
  min_amount: number
  max_amount: number
  tds_percentage: number
  max_daily_withdrawals: number
  max_monthly_amount: number
}

// Webhook Interfaces
export interface IWebhookPayload {
  event: string
  payload: {
    payout: {
      entity: IGatewayPayoutResponse
    }
  }
  created_at: number
}

export interface IWebhookResponse {
  success: boolean
  transaction_id?: string
  status_updated?: boolean
  error?: string
}

// Service Response Interfaces
export interface IServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    timestamp: string
    request_id?: string
    processing_time?: number
  }
}

// Error Codes Enum
export enum WithdrawalErrorCodes {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  WAITING_PERIOD_NOT_COMPLETED = 'WAITING_PERIOD_NOT_COMPLETED',
  MINIMUM_AMOUNT_NOT_MET = 'MINIMUM_AMOUNT_NOT_MET',
  MAXIMUM_AMOUNT_EXCEEDED = 'MAXIMUM_AMOUNT_EXCEEDED',
  BANK_ACCOUNT_NOT_VERIFIED = 'BANK_ACCOUNT_NOT_VERIFIED',
  DAILY_LIMIT_EXCEEDED = 'DAILY_LIMIT_EXCEEDED',
  MONTHLY_LIMIT_EXCEEDED = 'MONTHLY_LIMIT_EXCEEDED',
  GATEWAY_ERROR = 'GATEWAY_ERROR',
  DUPLICATE_TRANSACTION = 'DUPLICATE_TRANSACTION',
  CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',
  INVALID_BANK_ACCOUNT = 'INVALID_BANK_ACCOUNT',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
}

export default IRewardTransaction
