import { Roles } from '../enums/roles.enum'

export interface ICustomer {
  customerID?: number // Auto-increment primary key
  name: string // VARCHAR(100)
  firstName?: string // VARCHAR(100)
  middleName?: string // VARCHAR(100)
  lastName?: string // VARCHAR(100)
  gender?: 'Male' | 'Female' | 'NA' // ENUM('Male', 'Female', 'NA')
  dob: Date // DATE
  mobile: number // BIGINT
  email: string // VARCHAR(100)
  pancard?: string // VARCHAR(100)
  aadharNo?: number // BIGINT
  password: string // VARCHAR(255)
  marrital?: string // VARCHAR(10)
  profile?: string // VARCHAR(100)
  otp?: string // VARCHAR(20)
  isVerified?: boolean // BIT(1) // TODO : Test this
  employeeType: 'Salaried' | 'Self Employee' | 'Professional' | 'Not Employed' | 'NA' // ENUM
  createdDate?: Date // DATETIME
  industry?: string // TEXT
  designation?: string // TEXT
  working_since?: string // TEXT
  salary_date?: string // TEXT
  official_email?: string // TEXT
  education?: string // TEXT
  pan_cust_verified?: number // INT
  dob_digit_match?: '0' | '1' // ENUM('0', '1')
  is_pan_aadhar_linked?: 'Not' | 'Yes' | 'No' // ENUM
  is_dob_match?: 'Not' | 'Yes' | 'No' // ENUM
  status?: 'Incomplete' | 'Complete' // ENUM
  dob_digit_match_btn_click?: '0' | '1'
  sim_available?: string
  emandate_required?: '0' | '1'
  email_verification_status?: number
  email_delivery_status?: string
  email_last_validation?: Date
  step?: string
  ckyc_status?: CkycStatus
}

export enum CkycStatus {
  NOT_STARTED = 'Not Started',
  KYC_FAILED = 'KYC Failed',
  CKYC_FAILED = 'CKYC Failed',
  SUCCESS = 'Success',
}

export type TSelectCustomer = keyof ICustomer

export interface ICustomerLoginPayload {
  mobile: number
  appID: string
}
export interface IUser {
  userID: number
  name: string
  email: string
  mobile: number
  did_no?: string | null
  branch: string
  userName: string
  password: string
  role: Roles
  status: 'Active' | 'In Active'
  createdBy: number
  createdDate: Date
  accessPer: string
  utype: string
  firebase_token?: string | null
  device_token?: string | null
  lip: string
  convoque_login_id?: string | null
  convoque_exten?: string | null
  whatsapp_email?: string | null
  lead_status: string
  otp?: number | null
  password_updated_at?: Date | null
  mac_address?: string | null
  random_id?: string | null
  mac_otp?: string | null
  utmSource?: string | null
  sessionID?: string | null
  iu_date?: Date | null
}

export interface ITokenUser extends IUser {
  roleId: number
  permissions: Array<string>
}
export interface IGetApiLog {
  request: boolean
  response: boolean
}

export interface ICustomerID {
  customerID: number
}

export interface IGetApiLogId {
  id: number
}

export interface IGlobalSearchPayload {
  mobile: number
  leadID: number
  loanNo: string
  customerID: number
  name: string
  email: string
  pan: string
  aadharNo: number
}

export interface ICustomerUpdatePayload {
  customerID: number
  firstName?: string
  mobile?: number
  email?: string
  gender?: string
  dob?: Date
  pancard?: string
  aadharno?: number
}
export interface ICustomerPayload {
  search_by: string
  customer_search: string
}
export interface IWhereCondition {
  name?: string
  email?: string
  mobile?: number
  pancard?: string
  aadharNo?: number
}
export interface IRepaymentDate {
  leadID: number
  name: string
  mobile: number
  status: string
  repayDate: Date
  approvedAmount: number
  email?: string
  aadharNo: number
  pancard: string
  approvalID: number
}

export interface IUploadedFile {
  originalname: string
  mimetype: string
  size: number
  buffer: Buffer
  path: string
}

export interface ISourcePartnerPayload {
  id?: number
  image?: IUploadedFile
  name?: string
  link?: string
  status?: string
  userID?: number
}

export type TSelectRepaymentDate = keyof IRepaymentDate

export interface ICustomerLeadDetails {
  customerID: number
  firstName: string
  middlename: string | null
  lastName: string
  gender: string
  pancard: string
  dob: string // Consider using Date if you want date manipulation
  mobile: string
  email: string
  leadID: number
  monthlyIncome: number
  salaryMode: string
  address: string
  city: string
  state: string
  pincode: string
  employer_list: string | null
}
