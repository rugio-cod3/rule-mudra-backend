enum Gender {
  Male = 'Male',
  Female = 'Female',
  NA = 'NA',
}

enum DobDigitMatch {
  Not = 'Not',
  Yes = 'Yes',
  No = 'No',
}

enum IsVerifiedEmail {
  No = 'No',
  Yes = 'Yes',
}

enum DobDigitMatchBtnClick {
  Not = '0',
  Yes = '1',
}

enum IsPanAadharLinked {
  Not = 'Not',
  Yes = 'Yes',
  No = 'No',
}

export interface ICustomerApp {
  customerID: number
  name: string
  firstName: string
  middlename: string
  lastName: string
  gender: Gender
  dob: string
  mobile: bigint
  email: string
  pancard: string
  aadharNo: bigint
  password: string
  marrital: string
  profile: string
  otp: string
  isVerified: boolean
  employeeType: string
  createdDate: Date
  loanRequeried: number
  purposeloan: string
  companyName: string
  companyAddress: string
  monthlyIncome: number
  salaryMode: string
  residenceType: string
  residenceAddress: string
  device: string
  uid: string
  step: string
  state: string
  city: string
  pincode: string
  utmSource: string
  status: string
  lead_status: number
  new_form: number
  remark: string
  bank_name: string
  bank_ifsc: string
  bank_account_no: string
  bank_holder_name: string
  residenceAddress2: string
  landmark: string
  area: string
  industry: string
  designation: string
  working_since: string
  salary_date: string
  official_email: string
  education: string
  pan_cust_verified: number
  dob_digit_match: DobDigitMatch
  office_email_id: string
  office_email_otp: string
  is_verified_email: IsVerifiedEmail
  sim_available: string
  dob_digit_match_btn_click: DobDigitMatchBtnClick
  is_pan_aadhar_linked: IsPanAadharLinked
  is_dob_match: DobDigitMatch
  email_verification_status: number;
  email_delivery_status: string;
  email_last_validation: string;
}

export type TSelectCustomerApp = keyof ICustomerApp