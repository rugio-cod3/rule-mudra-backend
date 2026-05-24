import { ApprovalStatus } from '../enums/approvalStatus.enums'
import { LeadStatus } from '../enums/lead.enum'

export interface IApproval {
  approvalID?: number // int AI PK
  customerID: number // int
  leadID: number // int
  loanType?: number // int
  productType?: string // varchar(255)
  branch: string // varchar(255)
  loanAmtApproved: number // double(10,2)
  tenure: number // int
  roi: number // double(10,2)
  repayDate: Date | string // date
  adminFee: number // double(10,2)
  plateFormFee?: number // double(10,2)
  convinineceFee?: number // double(10,2)
  creditRiskAnalisys?: number // double(10,2)
  GstOfAdminFee?: number // double(10,2)
  alternateMobile: string // varchar(20)
  officialEmail: string // varchar(100)
  monthlyIncome?: number // double(10,2)
  cibil: number // int
  activeLoans?: number // int
  activePL?: number // int
  activeHL?: number // int
  activeCC?: number // int
  activePaydayLoan?: number // int
  outstandingAmount?: number // double(10,2)
  monthlyObligation?: number // double(10,2)
  status: ApprovalStatus | LeadStatus
  // | 'Approved'
  // | 'Rejected'
  // | 'Hold'
  // | 'Approved Process'
  // | 'Rejected Process'
  // | 'Hold Process'
  // | 'Not Required'
  // | 'Not Required Process' // enum
  formNo?: string // varchar(255)
  employed?: string // varchar(255)
  remark?: string // varchar(255)
  loanRequirePurpose?: string // varchar(255)
  creditedBy: number // int
  rejectionReason?: string // varchar(255)
  documentr?: string // varchar(512)
  redFlag?: string // varchar(255)
  createdDate?: Date // datetime
  sanctionalloUID?: string // varchar(216)
  customerApproval?: '0' | '1' // enum('0','1')
  employmentType?: string // varchar(50)
  m1?: string // varchar(64)
  m2?: string // varchar(64)
  m3?: string // varchar(64)
  m_avg?: string // varchar(64)
  p1?: string // varchar(128)
  p2?: string // varchar(128)
  p3?: string // varchar(128)
  m1_date?: string // varchar(64)
  m2_date?: string // varchar(64)
  m3_date?: string // varchar(64)
  disbursalRemark?: string
}

export type TSelectApproval = keyof IApproval
