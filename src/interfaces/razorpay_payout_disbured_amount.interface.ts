export interface IRazorpayPayoutDisbursedAmount {
  disID: number // Auto-increment primary key
  disbDate: Date
  id: string
  entity: string
  fund_account_id: string
  amount: string
  currency: string
  notes_key_1: string
  notes_key_2: string
  fees: string
  tax: string
  status: string
  utr: string
  mode: string
  purpose: string
  reference_id: string
  narration: string
  batch_id: string
  description: string
  source: string
  reason: string
  merchant_id: string
  status_details_id: string
  customerID: string
  leadID: string
  creadatedDate: Date // Datetime type in SQL
  failure_reason: string
  uid: string
  reamrk: string // Medium text
  api_log: string // Long text
  bank_changed: boolean // Tinyint (1 or 0)
  is_checked: '0' | '1' // Enum ('0', '1')
}
