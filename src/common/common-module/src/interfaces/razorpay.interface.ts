export interface IRazorpaySubscriptionRegistrationRequest {
  customer: {
    name: string
    email: string
    contact: string
  }
  type: string
  amount: number
  currency: string
  description: string
  subscription_registration: {
    method: string
    auth_type: string
    expire_at: number
    max_amount: number
    bank_account: {
      beneficiary_name: string
      account_number: string
      account_type: string
      ifsc_code: string
    }
  }
  receipt: string
  expire_by: number
  sms_notify: number
  email_notify: number
  notes: Record<any, any>
}

export interface ICreateEmandateLink {
  name: string
  email: string
  contact: string
  amount: number
  accountNo: string
  accountType: string
  ifsc: string
}

export interface IRazorpaySubscriptionRegistrationResponse {
  id: string
  entity: string
  receipt: string
  invoice_number: string
  customer_id: string
  customer_details: {
    id: string
    name: string
    email: string
    contact: string
    gstin: string | null
    billing_address: string | null
    shipping_address: string | null
    customer_name: string
    customer_email: string
    customer_contact: string
  }
  order_id: string
  line_items: any[] // Adjust the type of line_items if needed
  payment_id: string | null
  status: string
  expire_by: number
  issued_at: number
  paid_at: number | null
  cancelled_at: number | null
  expired_at: number | null
  sms_status: string
  email_status: string
  date: number
  terms: string | null
  partial_payment: boolean
  gross_amount: number
  tax_amount: number
  taxable_amount: number
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  currency_symbol: string
  description: string
  notes: Record<any, any>
  comment: string | null
  short_url: string
  view_less: boolean
  billing_start: number | null
  billing_end: number | null
  type: string
  group_taxes_discounts: boolean
  created_at: number
  idempotency_key: string | null
}

export interface IRazorPayCreateOrderRequest {
  amount: number
  currency: 'INR'
  payment_capture?: boolean
  method?: string
  customer_id?: string
  receipt?: string
  notes?: Record<string, any>
  token?: {
    auth_type?: 'netbanking' | 'debitcard' | 'aadhar' | ''
    max_amount?: number
    expire_at?: number
    notes?: Record<string, any>
    bank_account?: {
      beneficiary_name?: string
      account_number?: string
      account_type?: string
      ifsc_code?: string
    }
  }
}

export interface IRazorPayCreateOrderResponse {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  offer_id: string | null
  status: string
  attempts: number
  notes: Record<string, any>
  created_at: number
  token: {
    method: string
    notes: Record<string, any>
    recurring_status: string | null
    failure_reason: string | null
    currency: string
    max_amount: number
    auth_type: string
    expire_at: number
    bank_account: {
      ifsc: string
      bank_name: string
      name: string
      account_number: string
      account_type: string
      beneficiary_email: string
      beneficiary_mobile: string
    }
    first_payment_amount: number
  }
}

export interface IRazorPayCreateRecurringPaymentRequest {
  email: string
  contact: number
  amount: number
  currency: 'INR'
  order_id: string
  customer_id: string
  token: string
  recurring: string
  description: string
  notes: Record<string, any>
}

export interface IRazorPayCreateRecurringPaymentResponse {
  razorpay_payment_id: string
}
