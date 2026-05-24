import { CollectedMode, CollectionStatus } from '../enums/collection.enum'
import { BankAccountType } from '../enums/customerBankAccount.enum'
import {
  Designation,
  Industry,
  LeadStatus,
  ReferenceRelation,
  SalaryMode,
  TotalExperience,
  UploadPlatform,
} from '../enums/lead.enum'
import { IPagination } from './common.interface'

export interface ILead {
  leadID?: number
  customerID: number
  userID?: number
  purpose?: string
  loanRequeried?: number // Adjusted the spelling to match TypeScript naming conventions
  tenure?: number
  monthlyIncome?: number
  salaryMode?: string
  city?: string
  state?: string
  pincode?: number
  status?: LeadStatus
  utmSource?: string
  fbLeads?: string
  domainName?: string
  commingLeadsDate?: string
  ip?: string
  callAssign?: number
  creditAssign?: number
  createdDate?: Date
  alloUID?: string
  sanctionalloUID?: number
  sanctionAppID?: string
  entity_id?: string
  field_officer_id?: string
  field_officer_assign_date?: string
  field_officer_lead_status?: number
  em_id?: number
  step?: string
  kfs?: '0' | '1'
  bureauVersion?: string
  bankingSurrogateVersion?: string
  MLresponse?: string
  MLfeatures?: string
  MLamount?: number // The type `double(28,0)` is approximated with a number
  MLsalary?: number // The type `double(28,0)` is approximated with a number
  mlDateTime?: Date
  productID?: number
  ipc?: number
  hold_date?: Date | string
  hold_time?: string
  iu_date?: Date
  lenderID?: number
}
export interface ILeadUpdatePayload {
  leadID: number
}

export interface ILeadPageName extends IPagination {
  pageName: string
  caseType: string
  employeeType?: string
  leadID?: number
  leadStartDate?: string
  leadEndDate?: string
  allocated?: string
  utmSource?: string
  status?: string
  skip: number
  limit: number
}

export interface IAgainNoLoan extends IPagination {
  caseType?: string
  employeeType?: string
  leadID?: number
  leadStartDate?: string
  leadEndDate?: string
  allocated?: string
  utmSource?: string
  status?: string
  device?: string
}

export interface IAutoAllocation {
  authUserID: number
}

export interface ILeadPageNameFilter {
  pageName: string
  kfs_ip?: '1' | '0'
  utm_assigned_date?: Date
}

export type TSelectLead = keyof ILead

export interface IChargeEmandatePayload {
  emandateID: number
  emandateAmount: number
  remark: string
  leadID: number
}

export interface ICreateEmploymentDetails {
  totalExperience: TotalExperience
  officialEmailId: string
  designation: Designation
  officeAddress: string
  industry: Industry
  income: number
  salaryMode: SalaryMode
  employerID: number
  leadID: number // param
}

export interface IRepaymentPagePayload {
  leadID: number
}

export interface ICreateAddressPayload {
  leadID: number
  address: string
  city: string
  state: string
  pincode: number
}
export interface IRepayAmount {
  totalRepayAmount: number
}

export interface INoDuesPayload {
  leadID: number
  customerID: number
}
export interface ITransactionDetail {
  date: string
  particular: string
  debit: string | number
  credit: string | number
}

export interface ISummary {
  debit: number
  credit: number
}
export interface IAddCollection {
  leadID?: number
  cooling_period?: string
  collectedAmount: number
  status: CollectionStatus
  collectedMode: CollectedMode
  collectedDate: string
  referenceNo: string
  discountAmount?: number
  settlemenAmount?: number
  remark?: string
  discount_waiver?: string
  discount_waiver_amount?: string
  userID: number
  collectionStatus?: CollectionStatus
}
export interface IPaydayIpc {
  totalRepayAmount: number
  totalInterest: number
  charges: number
  principalAmount: number
}

export interface ILeadProfilePayload {
  leadID: number
}
export interface IAddCollectionFollowup {
  followType: string
  StatusType: string
  remark: string
  leadID: number
  followup_type: number
}
export interface IReferenceDetailsPayload {
  name: string
  relation: ReferenceRelation
  mobileNo: number
  leadID: number
}

export interface IReferenceModel {
  referenceID?: number
  customerID: number
  relation: ReferenceRelation
  name: string
  address: string
  city: string
  state: string
  pincode: number
  contactNo: number
  createdBy?: number
  createdDate?: Date
  name_contact?: string
  reference_verify?: number
  is_verified?: number
  recording?: string
  upload_platform?: UploadPlatform
}

export interface IPincode {
  pincode: number
}

export interface IModifyLoanDetailsPayload {
  roi: number
  adminFee: number
  loanAmount: number
  processingFee: number
  repaymentDate: Date
}
export interface IEmiCollection {
  collectedAmount: number
  collectedMode: string
  referenceNo: number
  collectedDate: Date
  status: string
  leadID?: number
  userID?: number
  remarks?: string
  waiver?: number
  discount_type?: string
}

export interface IModifyEmiLoanDetailsPayload {
  roi: number
  adminFee: number
  loanAmount: number
  processingFee?: number
  repaymentDate: number
  tenure: number
}
export interface IDownloadCollectionCSVResponse {
  statusCode: number
  data: {
    csvData: string
  }
  message: string
}

export interface IBaseLeadStatusChange {
  status: LeadStatus
  leadID: number
  customerID: number
  userID: number
  remark: string
  noteli: string
  reason: string
  leadStatus?: LeadStatus
}

export interface IChangeRejectHoldStatuses extends IBaseLeadStatusChange {
  adminFee: number
  employmentType: string
  holdDate: Date
  holdTime: string
}

export interface IChangeBlackListedOrWhiteListedStatus
  extends IBaseLeadStatusChange {
  pancard: string
  mobile: number
  lastLeadStatus: LeadStatus
}

export interface IChangeLeadStatusToApproved extends IBaseLeadStatusChange {
  loanAmtApproved: number
  accountType: 'old' | 'new'
  accountID: number
  newAccountType: BankAccountType // Savings or Salary
  bankName: string
  clientIp: string
  tenure: number
  roi: number
  repaymentDate: string
  adminFee: number
  plateFormFee: number
  alternateMobile: number
  officialEmail: string
  m1: string
  m2: string
  m3: string
  m_avg: string
  p1: string
  p2: string
  p3: string
  m1_date: string
  m2_date: string
  m3_date: string
  employmentType: string
  accountNo: string
  bankIfsc: string
  productID: number
}

export interface IChangeLeadStatusToApprovedProcess
  extends IBaseLeadStatusChange {
  loanAmtApproved: number
  tenure: number
  roi: number
  repaymentDate: string
  adminFee: number
  plateFormFee: number
  alternateMobile: string
  officialEmail: string
  m1: string
  m2: string
  m3: string
  m_avg: string
  p1: string
  p2: string
  p3: string
  m1_date: string
  m2_date: string
  m3_date: string
  employmentType: string
  loanType: 'emi' | 'payday'
}

export interface IChangeLeadStatusFreshLead extends IBaseLeadStatusChange {
  email: string
  mobile: number
  pancard: string
  lastLeadStatus: LeadStatus
}

export interface IChangeLeadStatusToDisbursed extends IBaseLeadStatusChange {}

export interface IChangeLeadStatusToApprovedProcessEmi
  extends IBaseLeadStatusChange {
  loanAmtApproved: number
  tenure: number
  roi: number
  repaymentDate: string
  adminFee: number
  plateFormFee: number
  alternateMobile: number
  officialEmail: string
  m1: string
  m2: string
  m3: string
  m_avg: string
  p1: string
  p2: string
  p3: string
  m1_date: string
  m2_date: string
  m3_date: string
  employmentType: string
}

export interface IBankUpdateCheckPayload {
  primaryAccountId: number
  secondaryAccountId: number
  isReference1Verified: boolean
  isReference2Verified: boolean
  isSelfieClear: boolean
  isCustomerTransferSalaryToAnotherAccount: boolean
  IsEmandateGreaterEqualToLoanAmount: boolean
  isPennyDropCompleted: boolean
  isPanAadharSelfieVerified: boolean
  isAddressAndEmploymentDetailsPresent: boolean
  isRepaymentDateVerified: boolean
  isLoanAmountVerified: boolean
  loanAcceptanceMode: 'Key Fact Sheet' | 'Mail Revert'
}

export interface IBankUpdatePayload {
  accountID: number
  accountType: 'new' | 'old'
  bankName?: string
  accountNo?: string
  ifsc?: string
}

export interface IDisbursalUpdatePayload {
  disbursalDate: Date
  disbursalReferenceNo: string
  remarks?: string
}

export interface ICreditListPayload {
  credit: string
  search_by: string
  customer_search: string
  lead_id: number
  city: string
  state: string
  status: string | object
  lead_case: string
  employment_type: string
  salary_mode: string
  monthly_income: number
  start_date: string
  end_date: string
  allocated: number
  apID: number
  scID: number
  utm_source: string
  flow: string
  device: string
  allocatedFilter: number
  userID?: number
  isExcelDownload?: string
  page?: number
  limit?: number
}

export interface ISanctionListPayload {
  sanction: string
  search_by: string
  customer_search: string
  lead_id: number
  city: string
  state: string
  status: string | object
  lead_case: string
  employment_type: string
  salary_mode: string
  monthly_income: number
  disposition: string
  start_date: string
  end_date: string
  allocated: number
  apID: number
  utm_source: string
  flow: string
  device: string
  action_start_date: string
  action_end_date: string
  allocatedFilter: number
  userID?: number
  isExcelDownload?: string
  page?: number
  limit?: number
}

export interface IUnprocessedListPayload {
  search_by: string
  customer_search: string
  lead_id: number
  city: string
  state: string
  status: string | object
  lead_case: string
  employment_type: string
  salary_mode: string
  monthly_income: number
  start_date: string
  end_date: string
  allocated: number
  utm_source: string
  flow: string
  device: string
  allocatedFilter: number
  userID?: number
  isExcelDownload?: string
  page?: number
  limit?: number
}

export interface IAgainNoLoanListPayload {
  search_by: string
  customer_search: string
  lead_id: number
  city: string
  state: string
  status: string | object
  lead_case: string
  start_date: string
  end_date: string
  allocated: number
  utm_source: string
  device: string
  userID?: number
  isExcelDownload?: string
  page?: number
  limit?: number
}

export interface IRepaymentDatePayload {
  approvalID: number
  date: Date
  leadID: number
  customerID: number
}
export interface INameMismatch {
  customerID: number
  name: string
  mobile: number
  createdDate: Date
  pancard: string
  account: number
  pancard_name?: string
  percentage_pancard?: string
  aadhar_name?: object
  percentage_aadhar?: string
  finbox_name?: string
  pennyDropID?: number
  registerName?: string
  pennyCreatedDate?: Date
  finboxID: number
}

export interface INoEligibleListPayload {
  search_by: string
  customer_search: string
  lead_id: number
  city: string
  state: string
  lead_case: string
  start_date: string
  end_date: string
  allocated: number
  utm_source: string
  flow: string
  device: string
  userID?: number
  isExcelDownload?: string
  page?: number
  limit?: number
}
export type TSelectNameMismatch = keyof INameMismatch

export interface INoLoanFollowUpLogs {
  id?: number
  lead_id: number
  customer_id: number
  follow_up_by: number
  follow_type: string
  status_type: string
  remark: string
  created_at: Date
  updated_at: Date
  iu_date: Date
}

export type TSelectNoLoanFollowUpLogs = keyof INoLoanFollowUpLogs

export interface IAgainNoLoanFollowUpLogsSchema {
  lead_id: number
  customer_id: number
  follow_type: string
  status_type: string
  remark: string
}

export interface IGetAgainNoLoanFollowUpLogsQuery {
  lead_id: number
  customer_id: number
  page: number
  limit: number
}

export interface IAllocateToMePayload {
  leadID: number
  customerID: number
  type: string
}

export interface TimeLineResponseDto {
  status: string
  remarks: string
  amount?: string
  updatedBy: string
  updatedDateIST: string
  role: string
}

export interface ICreditDetailPayload {
  leadID: number
}

export interface ICollectionUpdateModelPayload {
  leadID: number
  customerID: number
  referenceNo: string
  id: number
  loanNo: string
  collectedMode: string
  remark: string
  status: string
  userID: number
  productID: number
}

export interface ILeadRefundUpdatePayload {
  collectionID: number
  leadID: number
  refundDate: string
  utrNo: string
  status: string
  remark: string
  prAmount: number
  userID: number
}

export interface ICheckPennyDropPayload {
  leadID: number
  accountNo: string
  noteli: string
  remark: string
  userID: number
}
export interface ILeadData {
  leadID: number
  customerID: number
  loanNo: string
  repayDate: string
  disbursalDate: string
  disbursalAmount: number
  roi: number
  status: string
}

export interface ICollectionData {
  collectionID: number
  collectedAmount: number
  status: string
}

export interface IDataCode {
  Total_Payable_Amount: number
  Remanning_Amount: number
  RepayDate: string
}
export interface ICheckRejectedStatusResponse {
  daysLeft: number
  isRejected: boolean
}
