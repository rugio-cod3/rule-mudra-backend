import { LeadStatus } from '@/enums/lead.enum'

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
  kfs_ip?: '1' | '0'
  utm_assigned_date?: Date
  lenderID?: number
  plateform?: string
  iu_date?: Date
}

export interface ILeadPageName {
  pageName: string
  caseType: string
  skip: number
  limit: number
}

export type TSelectLead = keyof ILead

export interface ICheckRejectedStatusResponse {
  daysLeft: number
  isRejected: boolean
}
