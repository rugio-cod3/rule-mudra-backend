export interface ICredit {
  creditID: number // Primary Key
  customerID: number
  leadID: number
  productID: number
  branch: string // varchar(45)
  foir: number // double
  aqb: number // double
  roi: number // int
  tenure: number // int
  actualTenure: number // int
  interest: number // int
  repaymentAmount: number // int
  totalEMIs: number // int
  emiLeft: number // int
  processingFee: number //
  paidAmount: number // int
  paneltyEmis: number // int
  status: string //["initiated","approved","disbursed","rejected","closed"]
  principal: number
  amountToBeRepayed: number
  firstDueDate: Date
  brokenPeriodIntrest: number
  gst: number
  created_at: Date,
  disbursalDate?:Date
}

export type TSelectCredit = keyof ICredit
