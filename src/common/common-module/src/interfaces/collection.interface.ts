import { CollectedMode, CollectionStatus, CollectionType } from '../enums/collection.enum'
import { IPaginate } from './common.interface'

export interface ICollection {
  collectionID?: number
  customerID?: number
  leadID?: number
  loanNo?: string
  collectedAmount?: number
  penaltyAmount?: number
  collectedMode?: CollectedMode
  collectedDate?: Date
  referenceNo?: string
  discountAmount?: number
  settlemenAmount?: number
  status?: CollectionStatus
  remark?: string
  collectedBy?: number
  createdDate?: Date
  collectionStatus?: string
  collectionStatusby?: string
  approvedDate?: Date
  orderID?: string
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
  collectedDateIST?: string
  refundType?: string
  refundRemarks?: string
  approvedBy?: string
  amount?: number
  mode?: string
  remarks?: string
}

export interface IPendingCollection extends IPaginate {
  search_by?: string
  customer_search?: string
  start_date?: string
  end_date?: string
  dpd?: string
}

export interface IWaiveOffLoanDetails {
  findType: string
  id: number
}

export interface IWaiveOffAddRequest {
  customerId: number
  leadId: number
  loanId: number
  amount: number
  remark: string
}

export interface IAllocateMultipleLeads {
  leadIds: number[]
  userId: number
}

export interface IGetCollectionReport extends IPaginate {
  search_by?: string
  customer_search?: string
  lead_id?: string
  start_date?: string
  end_date?: string
  city?: string
  state?: String
  lead_case?: string
  employment_type?: string
  salary_mode?: string
  monthly_income?: string
  page_name: string
}

export type TSelectCollection = keyof ICollection

export interface ICollectionManagerPayload extends IPaginate {
  type: 'payday' | 'emi'
  customer_search: string
  collectionType: CollectionType
  collected_mode?: CollectedMode
  start_date?: string
  end_date?: string
}

export interface IPaydayCollectionDetails {
  status: string
  collectedMode: string
  loanAmount: number
  referenceNo: string
  remark: string
  collectedByName: string
  approvedByName: string
  date: Date
  approvedDate: Date
  loanNo: string
  paymentDate: Date
  discountAmount: number
  settlementAmount: number
  ipc: number
  leadStatus: string
  customerID: number
  name: string
  mobile: number
  email: string
  leadID: number
  repayDate: Date
  roi: number
  disbursalDate: Date
  totalCollection: number
  paidAmount: number
  repaymentAmount: number
}

export interface IPaydayCollectionDetailsCsv {
  'Loan Amount': number
  Status: string
  'Collected Mode': string
  'Reference Number': string
  Remark: string
  'Collected By': string
  'Approved By': string
  Date: string
  'Approved Date': string
  'Loan Number': string
  'Payment Date': string
  'Discount Amount': number
  'Settlement Amount': number
  Name: string
  Mobile: number
  Email: string
  'Repay Date': string
  'Total Collection': number
  'Paid Amount': number
  'Repayment Amount': number
}

export interface IEmiCollectionDetails {
  loanNo: string
  paymentMode: string
  transactionDate: Date
  createdAt: string
  referenceNo: string
  remarks: string
  name: string
  email: string
  mobile: number
  paymentStatus: string
  waiver: number
  amount: number
  showApprovedRejectButton: number
  status: string
  createdBy: string
}

export interface IEmiCollectionDetailsCsv {
  'Loan Number': string
  'Payment Mode': string
  'Transaction Date': string
  'Created At': string
  'Reference Number': string
  Remarks: string
  Name: string
  Email: string
  Mobile: number
  'Transaction Status': string
  Waiver: number
  Amount: number
  Status: string
  'Created By': string
}

export interface ICollectionManagerActionPayload {
  collectionID: number
  transactionID: number
  action: 'Accepted' | 'Rejected'
  type: 'emi' | 'payday'
}

export interface ICollectionManagerActionPayloadForMultiple {
  ids: number[]
  action: 'Accepted' | 'Rejected'
  type: 'emi' | 'payday'
}
export interface IChangePaymentMode {
  leadID: number
  customerID: number
  referenceNo: string
  pId: number
  loanNo: string
  collectedMode: string
  loanType: string
  status: number
  userID: number
  remark?: string
}
