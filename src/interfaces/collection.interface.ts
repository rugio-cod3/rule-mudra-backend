// export interface ICollection {
//   collectionID: number
//   customerID: number
//   leadID: number
//   loanNo: string
//   collectedAmount: number
//   penaltyAmount: number
//   collectedMode:
//     | 'Account'
//     | 'UPI'
//     | 'Cash'
//     | 'PayTM'
//     | 'E-Mandate'
//     | 'Payment Getway'
//     | 'HYPTO Bank- Virtual A/c'
//     | 'Razorpay Bank'
//     | 'RAZORPAY PAYMENT GATEWAY'
//     | 'GOOGLE PAY'
//     | 'CASHFREE PAYMENT GATEWAY'
//     | 'ICICI BANK-1435'
//     | 'ICICI BANK-7788'
//     | 'CUB'
//     | 'IDBI Bank-4213'
//     | 'SOUTH INDIAN-4754'
//     | 'CSB BANK-5000'
//     | 'INDUSIND BANK-9999'
//     | 'BHARAT SONI PAYTM'
//     | 'DISCOUNT'
//     | 'Waive Off'
//   collectedDate: Date
//   referenceNo: string
//   discountAmount: number
//   settlemenAmount: number
//   status: 'Closed' | 'Part Payment' | 'Settlement' | 'EMI Closed'
//   remark: string
//   collectedBy: number
//   createdDate: Date
//   collectionStatus: string
//   collectionStatusby: string
//   approvedDate: Date
//   orderID: string
//   excess_amount: string
//   discount_waiver: string
//   discount_waiver_amount: string
//   refund_utr_no: string
//   closing_balance?: number
//   principal_amount?: number
//   penality_charge?: number
//   total_interest?: number

import { CollectedMode, CollectionStatus } from '@/enums/collection.enum'

// }
export interface ICollection {
  collectionID?: number
  customerID: number
  leadID: number
  loanNo: string
  collectedAmount: number
  penaltyAmount?: number
  collectedMode?: CollectedMode
  collectedDate: string
  referenceNo: string
  discountAmount: number
  settlemenAmount: number
  status: CollectionStatus
  remark: string
  collectedBy: number
  createdDate?: Date
  collectionStatus: string
  collectionStatusby: string
  approvedDate?: Date
  orderID: string
  excess_amount?: string
  discount_waiver?: string
  discount_waiver_amount?: string
  refund_utr_no?: string
  opening_balance?: number
  closing_balance?: number
  total_interest?: number
  principal_amount?: number
  penality_charge?: number
  collected_interest?: number
  collected_principal?: number
  collected_penality?: number
  updated_date?: Date
  iu_date?: Date
  lenderID?: number
}

export interface IRazorpayPaydayRepayment {
  leadId: number
  razorpayOrderId: string
  toValue: number
}

interface AcquirerData {
  rrn: string
}

interface PaymentEntity {
  id: string
  entity: string
  amount: number
  currency: string
  base_amount: number
  status: string
  order_id: string
  invoice_id: string | null
  international: boolean
  method: string
  amount_refunded: number
  amount_transferred: number
  refund_status: string | null
  captured: boolean
  description: string | null
  card_id: string | null
  bank: string | null
  wallet: string | null
  vpa: string | null
  email: string
  contact: string
  notes: any
  fee: number
  tax: number
  error_code: string | null
  error_description: string | null
  error_source: string | null
  error_step: string | null
  error_reason: string | null
  acquirer_data: AcquirerData
  created_at: number
}

interface Payment {
  entity: PaymentEntity
}

interface Payload {
  payment: Payment
}

export interface IRazorpayWebhook {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: Payload
  created_at: number
}

export interface IRazorpayKafkaConsumer {
  method: string,
  order_id: string,
  on_hold_until: string | null,
  reference10: string | null,
  reference11: string | null,
  reference12: string | null,
  reference13: string | null,
  reference14: string | null,
  reference15: string | null,
  reference16: string | null,
  otp_attempts: number | null,
  customer_id: string | null,
  authorized_at: number | null,
  two_factor_auth: string | null,
  email: string,
  cps_route: number,
  global_token_id: string | null,
  otp_count: number,
  captured_at: number,
  reference2: string | null,
  tax: number,
  late_authorized: number,
  callback_url: string,
  description: string,
  store_id: string,
  disputed: number,
  auth_type: string,
  base_amount: number,
  emi_plan_id: string,
  signed: number,
  reference17: string,
  contact: string,
  public_key: string,
  reference3: number,
  gateway: string,
  receiver_id: string,
  amount: number,
  mdr: string,
  global_customer_id: string,
  acknowledged_at: number,
  recurring: number,
  bank: string,
  refund_at: number,
  refund_status: string,
  transaction_id: string,
  id: string,
  cancellation_reason: string,
  transfer_id: string,
  base_amount_refunded: number,
  amount_refunded: number,
  terminal_id: string,
  international: number,
  gateway_captured: number,
  convert_currency: number,
  reference6: string,
  status: 'authenticated' | 'refunded' | 'pending' | 'authorized' | 'created' | 'captured' | 'failed',
  error_description: string | null,
  card_id: string | null,
  token_id: string | null,
  internal_error_code: number | null,
  recurring_type: string | null,
  fee_bearer: number,
  currency: string,
  amount_authorized: number,
  reference9: string | null,
  created_at: number,
  receiver_type: string | null,
  subscription_id: number | null,
  notes: string,
  emi_subvention: string | null,
  vpa: string | null,
  app_token: string | null,
  settled_by: string | null,
  verify_bucket: string | null,
  save: number,
  auto_captured: number,
  updated_at: number,
  batch_id: string | null,
  amount_paidout: number,
  reference1: string | null,
  error_code: string | null,
  verify_at: number,
  merchant_id: string,
  wallet: string | null,
  verified: string | null,
  payment_link_id: string | null,
  invoice_id: string | null,
  authentication_gateway: string | null,
  reference5: string | null,
  amount_transferred: number,
  authenticated_at: number | null,
  on_hold: number,
  fee: number | null
}
export interface IRazorpayVerification {
  razorpay_paymentId: string
  razorpay_orderId: string
  method: string
  status: string
  amount: number
  createdAt: number
  mandateDate?: string
}
export interface IRazorpayEmi {
  amount: number
  order_id: string
  status: string
  id: string
  transactionDate: string
}
export type TSelectCollection = keyof ICollection
