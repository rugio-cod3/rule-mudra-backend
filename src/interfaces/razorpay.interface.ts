export interface IRazorPayCreateCustomerRequest {
  name: string;
  email: string;
  contact: string;
  fail_existing?: "1" | "0";
  notes?: {
    note_key_1: string;
    note_key_2: string;
  };
}

export interface IRazorPayCreateCustomerResponse {
  id: string;
  entity: string;
  name: string;
  email: string;
  contact: string;
  gstin: string | null;
  notes: {
    note_key_1: string;
    note_key_2: string;
  };
  created_at: number;
}

export interface IRazorPayCreateOrderRequest {
  amount: number;
  currency: "INR";
  payment_capture?: boolean;
  method: string;
  customer_id: string;
  receipt?: string;
  notes?: Record<string, any>;
  token?: {
    auth_type?: "netbanking" | "debitcard" | "aadhar" | "";
    max_amount?: number;
    expire_at?: number;
    notes?: Record<string, any>;
    bank_account?: {
      beneficiary_name?: string;
      account_number?: string;
      account_type?: string;
      ifsc_code?: string;
    };
  };
  recurring?: boolean;
}

export interface IRazorPayCreateOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
  token: {
    method: string;
    notes: Record<string, any>;
    recurring_status: string | null;
    failure_reason: string | null;
    currency: string;
    max_amount: number;
    auth_type: string;
    expire_at: number;
    bank_account: {
      ifsc: string;
      bank_name: string;
      name: string;
      account_number: string;
      account_type: string;
      beneficiary_email: string;
      beneficiary_mobile: string;
    };
    first_payment_amount: number;
  };
}

export interface IRazorPayPaymentsResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: string;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string | null;
  card_id: string | null;
  bank: string;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  customer_id: string;
  token_id: string;
  notes: Record<string, any>;
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_step: string | null;
  error_reason: string | null;
  acquirer_data: Record<string, any>;
  created_at: number;
}

export interface IFetchPaymentPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  leadID: number;
  accountID: number;
}

export interface IRazorPayFetchInvoice {
  id: string;
  entity: string;
  receipt: string | null;
  invoice_number: string | null;
  customer_id: string;
  customer_details: {
    id: string;
    name: string;
    email: string;
    contact: string;
    gstin: string | null;
    billing_address: {
      id: string;
      type: string;
      primary: boolean;
      line1: string;
      line2: string;
      zipcode: string;
      city: string;
      state: string;
      country: string;
    };
    shipping_address: {
      id: string;
      type: string;
      primary: boolean;
      line1: string;
      line2: string;
      zipcode: string;
      city: string;
      state: string;
      country: string;
    };
    customer_name: string;
    customer_email: string;
    customer_contact: string;
  };
  order_id: string;
  line_items: {
    id: string;
    item_id: string | null;
    ref_id: string | null;
    ref_type: string | null;
    name: string;
    description: string;
    amount: number;
    unit_amount: number;
    gross_amount: number;
    tax_amount: number;
    taxable_amount: number;
    net_amount: number;
    currency: string;
    type: string;
    tax_inclusive: boolean;
    hsn_code: string | null;
    sac_code: string | null;
    tax_rate: number | null;
    unit: string | null;
    quantity: number;
    taxes: any[];
  }[];
  payment_id: string | null;
  status: "issued" | "paid" | "partially_paid" | "cancelled" | "expired";
  expire_by: number;
  issued_at: number;
  paid_at: number | null;
  cancelled_at: number | null;
  expired_at: number | null;
  sms_status: string;
  email_status: string;
  date: number;
  terms: string | null;
  partial_payment: boolean;
  gross_amount: number;
  tax_amount: number;
  taxable_amount: number;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  currency_symbol: string;
  description: string;
  notes: string[];
  comment: string | null;
  short_url: string;
  view_less: boolean;
  billing_start: number | null;
  billing_end: number | null;
  type: string;
  group_taxes_discounts: boolean;
  created_at: number;
  idempotency_key: string | null;
}
