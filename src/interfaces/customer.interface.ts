import { IAddress } from "./address.interface";
import { ILead } from "./lead.interface";
import { IStepControlModel } from "./step-control.interface";

export interface ICustomer {
  user_id?: number;
  customerID?: number; // Auto-increment primary key
  name: string; // VARCHAR(100)
  firstName?: string; // VARCHAR(100)
  middleName?: string; // VARCHAR(100)
  lastName?: string; // VARCHAR(100)
  gender?: "Male" | "Female" | "NA"; // ENUM('Male', 'Female', 'NA')
  dob: Date; // DATE
  mobile: number; // BIGINT
  email: string; // VARCHAR(100)
  pancard?: string; // VARCHAR(100)
  aadharNo?: string; // BIGINT
  password: string; // VARCHAR(255)
  marrital?: string; // VARCHAR(10)
  profile?: string; // VARCHAR(100)
  otp?: string; // VARCHAR(20)
  isVerified?: boolean; // BIT(1) // TODO : Test this
  employeeType:
    | "Salaried"
    | "Self Employee"
    | "Professional"
    | "Not Employed"
    | "NA"; // ENUM
  createdDate?: Date; // DATETIME
  industry?: string; // TEXT
  designation?: string; // TEXT
  working_since?: string; // TEXT
  salary_date?: string; // TEXT
  official_email?: string; // TEXT
  education?: string; // TEXT
  pan_cust_verified?: number; // INT
  dob_digit_match?: "0" | "1"; // ENUM('0', '1')
  is_pan_aadhar_linked?: "Not" | "Yes" | "No"; // ENUM
  is_dob_match?: "Not" | "Yes" | "No"; // ENUM
  status?: "Incomplete" | "Complete"; // ENUM
  dob_digit_match_btn_click?: "0" | "1";
  sim_available?: string;
  emandate_required?: "0" | "1";
  email_verification_status?: number;
  email_delivery_status?: string;
  email_last_validation?: Date;
  step?: string;
  customerAadharNo?: number;
  aadhaarName?: string;
}

export type TSelectCustomer = keyof ICustomer;

export interface ICustomerLoginPayload {
  mobile: number;
  app_id: string;
  imei: string;
  utm_source?: string;
  plateform?: string;
}

// new interface for generate OTP

export interface FindCustomerAppID {
  is_pan_aadhar_linked: string;
  pancard: string | null;
  aadharNo: string | null;
  step: number;
  is_dob_match: boolean;
}

export interface ICustomerCheck {
  dashboard_message1?: string;
  dashboard_message2?: string;
  dashboard_message3?: string;
  dashboard_message4?: string;
  dashboard_message5?: string;
  dashboard_message6?: string;
  dashboard_message7?: string;
  rejected_apply?: number;
  customer_lead?: object;
  approval?: object;
  loan?: object;
  is_pancard?: boolean;
  is_aadhar?: boolean;
  is_digilocker?: boolean;
  emandate_status?: number;
  pennydrop_status?: number;
  kfs_status?: number;
  bre_status?: boolean;
  customer_details?: object;
  address?: object;
  employer_details?: object;
  finbox_status?: boolean;
  offerAmount?: number;
  flow_status?: string;
  step?: number;
  is_pan_aadhar_linked?: boolean;
  is_dob_match?: boolean;
  video_check?: number;
  selfie_check?: boolean;
  customerType?: string;
  checkBankAccount?: boolean;
  reference_status?: boolean;
  approvalAccept?: boolean;
  pre_approved_offerAmount?: number;
  currentVersion?: string;
}

export interface IDashboardMessages {
  customer: ICustomer;
  lead?: ILead;
  step?: IStepControlModel;
  customerType: string;
  rejectedDaysLeft?: number;
  userIp?: string;
  leadType: string;
}

export interface IDashboardMessageResponse {
  dobMatch: number;
  isPanAadharLinked: number;
  isKycFailure: boolean;
  step: IStepControlModel | null;
}

export interface IDashboardPayload {
  appVersion: string;
  residenceAddress: string;
  state: string;
  pincode: number;
  city: string;
}
export interface IRepaymentPagePayload {
  leadId: number;
  customer: {
    customerID: number;
  };
}

export interface IOnePageView {
  loanPurpose: string;
  maritalStatus: string;
  qualification: string;
  employementType: string;
  modeOfPayment: string;
  companyName: string;
  industry: string;
  designation: string;
  monthlySalary: number;
  salaryDate: string;
  address: IAddress;
}

export interface ICustomerFinboxAccountResponse {
  accountNumber: string | null;
  bankName: string | null;
  ifsc: string | null;
  name: string | null;
}
export interface IFinboxApiResponse {
  is_success: boolean;
  apimsg: {
    session_id: string;
    redirect_url: string;
  };
}
export interface IUser {
  user_id: number;
  name: string;
  userID?: number;
  email: string;
  mobile: string;
  did_no?: string | null;
  branch: string;
  userName: string;
  password: string;
  role: string;
  status: "Active" | "In Active";
  createdBy: number;
  createdDate: Date;
  accessPer: string;
  utype: string;
  firebase_token?: string | null;
  device_token?: string | null;
  lip: string;
  convoque_login_id?: string | null;
  convoque_exten?: string | null;
  whatsapp_email?: string | null;
  lead_status: string;
  otp?: number | null;
  password_updated_at?: Date | null;
  mac_address?: string | null;
  random_id?: string | null;
  mac_otp?: string | null;
  utmSource?: string | null;
  sessionID?: string | null;
  iu_date?: Date | null;
}

export interface IEmiSoaPayload {
  customerID: number;
  leadID: number;
}
interface Trans {
  id?: number;
  order_id?: string;
}

export interface IPaymentDetails {
  amount: number;
  paymentDate: Date;
  trans: Trans;
}

export interface IPayUTransactionResponse {
  amount: string;
  status: string;
}
