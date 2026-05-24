// export interface ITransection {
//   id: number // int UN AI PK
//   customerID: number // int
//   leadID: number // int
//   loanNo: string // varchar(256)
//   status: number // int
//   type: string // varchar(45) ["disbursal","collection","processing_fee","bpi","penalty"]
//   mode: string // varchar(45)
//   referenceNo: string // varchar(256)
//   orderId: string // varchar(256)
//   deleted: number // int
//   gateway: string // varchar(45)
//   createdAt: Date // datetime
//   updatedAt: Date // datetime
//   createdBy: number // int
//   updatedBy: number // int
//   amount:number //int
// }
export interface ITransection {
  discount_type: any
  id: number
  customerID: number
  leadID: number
  loanNo: string
  status: number
  type:
    | 'disbursal'
    | 'collection'
    | 'pf'
    | 'gst'
    | 'subscriptionCharged'
    | 'subscriptionActivation'
    | 'subscriptionChargedManual'
    | 'subscriptionAuthentication'
    | 'subscriptionInvoicePaid'
    | 'refund'
    | 'processing_fee'
    | 'bpi'
    | 'penalty'
    |'disbursed'
  mode:
    | 'Account'
    | 'UPI'
    | 'Cash'
    | 'PayTM'
    | 'E-Mandate'
    | 'Payment Gateway'
    | 'HYPTO Bank- Virtual A/c'
    | 'Razorpay Bank'
    | 'RAZORPAY PAYMENT GATEWAY'
    | 'GOOGLE PAY'
    | 'CASHFREE PAYMENT GATEWAY'
    | 'ICICI BANK-1435'
    | 'ICICI BANK-7788'
    | 'CUB'
    | 'IDBI Bank-4213'
    | 'SOUTH INDIAN-4754'
    | 'CSB BANK-5000'
    | 'INDUSIND BANK-9999'
    | 'BHARAT SONI PAYTM'
    | 'DISCOUNT'
    | 'Waive Off'
    | 'Payout'
    | 'manual'
  referenceNo: string
  orderId: string
  deleted: number
  gateway: string
  createdAt: Date
  updatedAt: Date
  createdBy: number
  updatedBy: number
  amount: number
  collectionID: number
  emiID: number
  transactionDate: Date
  remarks: string,
  payment_transaction_status:string,
  waiver:number
}

  /*
  for status column
  0- Failed
  1- Captured
  2- Pending
  3- Approved
  4- Rejected

  */

export interface IWhereClause {
  customerID: number 
  type?: { $in: string[] }
}
export interface IPayUReq{
  leadID: number,
  txnId:string,
  bank_ref_no :string,
  amount:number,
  payU_date:string
}
