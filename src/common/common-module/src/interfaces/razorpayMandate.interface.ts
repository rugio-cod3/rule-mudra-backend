export interface IRazorpayMandate {
  id?: number // Auto-incrementing primary key

  // Columns with data type `varchar` and a length specified can be represented as string
  customerID: number // varchar(256)
  accountNo: string // varchar(216)
  accountType: string // varchar(216)
  bank: string // varchar(216)
  ifsc: string // varchar(216)
  leadID: string // varchar(256)
  inv_id: string // varchar(256)
  entity: string // varchar(256)
  receipt: string // varchar(256)
  invoice_number: string // varchar(256)
  customer_id: string // varchar(256)
  cust_name: string // varchar(256)
  cust_email: string // varchar(256)
  cust_contact: string // varchar(256)
  order_id: string // varchar(256)
  status: string // varchar(256)
  sms_status: string // varchar(256)
  email_status: string // varchar(256)
  short_url: string // varchar(256)
  type: string // varchar(256)
  credated_date?: string // varchar(216)
  uid: string // varchar(216)
  devices?: string // varchar(216)
  etype: string // varchar(216)
  token_id: string // varchar(216)
  emMaxamount: number // number(256)
  res_response: string
  need_another_mandate?: '0' | '1'
  name_missmatch_reject?: '0' | '1'
  payment_id?: string
  lenderID?: string
  api_response?: string
}

export type TSelectRazorPayMandate = keyof IRazorpayMandate
