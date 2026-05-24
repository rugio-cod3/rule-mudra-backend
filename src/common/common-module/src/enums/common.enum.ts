export enum StepName {
  NAME_AND_EMAIL = 'NAME_AND_EMAIL',
  PAN_VERIFICATION = 'PAN_VERIFICATION',
  PAN_CONFIRMATION = 'PAN_CONFIRMATION',
  AADHAR_CONFIRMATION = 'AADHAR_CONFIRMATION',
  LOAN_PURPOSE = 'LOAN_PURPOSE',
  LOAN_AMOUNT = 'LOAN_AMOUNT',
  GENDER = 'GENDER',
  MARITAL_STATUS = 'MARITAL_STATUS',
  HIGHEST_EDUCATION = 'HIGHEST_EDUCATION',
  EMPLOYMENT_DETAILS = 'EMPLOYMENT_DETAILS',
  MODE_OF_PAYMENT = 'MODE_OF_PAYMENT',
  COMPANY_NAME = 'COMPANY_NAME',
  INDUSTRY = 'INDUSTRY',
  DESIGNATION = 'DESIGNATION',
  MONTHLY_INCOME = 'MONTHLY_INCOME',
  WORK_EXPERIENCE = 'WORK_EXPERIENCE',
  SALARY_DATE = 'SALARY_DATE',
  RESIDENCE_TYPE = 'RESIDENCE_TYPE',
  ADDRESS_CONFIRMATION = 'ADDRESS_CONFIRMATION',
  FINBOX = 'FINBOX',
  REFERENCE_DETAILS = 'REFERENCE_DETAILS',
  SELFIE_VERIFICATION = 'SELFIE_VERIFICATION',
  BANK_DETAILS = 'BANK_DETAILS',
  EMANDATE = 'EMANDATE',
  PENNY_DROP = 'PENNY_DROP',
  BANK_ACCOUNT_CONFIRMATION = 'BANK_ACCOUNT_CONFIRMATION',
  KFS = 'KFS',
  ONE_PAGE = '1_PAGE',
  LOAN_AMOUNT_CLOSED = 'LOAN_AMOUNT_CLOSED',
  PAN_REVERIFY = 'PAN_REVERIFY',
  // BILL_PAYMENT_RECEIPT = 'BILL_PAYMENT_RECEIPT',
}
export enum PanCardBlackListStatus {
  DEACTIVE = 'Deactive',
  ACTIVE = 'Active',
}

export enum ApiSupplierType {
  SUREPASS = 4,
  DECENTRO = 1,
  CIBIL = 3,
  FACE_MATCH = 5,
}

export enum SurePassApiUrl {
  PAN_COMPREHENSIVE = '/api/v1/pan/pan-comprehensive',
  AADHAR_SEND_OTP = '/api/v1/aadhaar-v2/generate-otp',
  AADHAR_SUBMIT = '/api/v1/aadhaar-v2/submit-otp',
  CKYC_SEARCH = '/api/v1/ckyc/search',
  CKYC_DOWNLOAD = '/api/v1/ckyc/download',
}
export enum DigitapApiUrl {
  PAN_COMPREHENSIVE = '/kyc/v1/pan_details_plus',
}

export enum DecentroApiUrl {
  AADHAR_INITIATE = '/kyc/digilocker/initiate_session',
  EAADHAR = '/kyc/digilocker/eaadhaar',
  GET_ACCESS_TOKEN = '/kyc/digilocker/access_token/code',
  UISTREAMS = '/kyc/workflows/uistream',
}
export enum LeadLogApiType {
  IDENTITY = 'identity',
  AADHAR_V2_GENERATE_OTP = 'aadhaar-v2-generate-otp',
  AADHAR_V2_SUBMIT_OTP = 'aadhaar-v2-submit-otp',
  DIGILOCKER_EAADHAR = 'digilocker_eaadhaar',
  DIGILOCKER_INITIATE_AADHAR = 'digilocker_initiate_session',
  DIGILOCKER_ACCESS_TOKEN = 'digilocker_access_token',
  PAN_COMPREHENSIVE = 'pan-comprehensive',
  XLSX_REPORT = 'xlsx_report',
  PREDICTORS = 'predictors',
  BANKING_SURROGATE = 'banking_surrogate',
  BUREAU_SURROGATE = 'bureau_sagorate',
  RAJAT_API_BUREAU = 'rajat_api_bureau',
  FOURTH_LOAN = 'Fourth_loan_amount_check',
  PAN_COMPREHENSIVE_DIGITAP = 'pan-comprehensive',
  CKYC_SEARCH = 'ckyc_search',
  CKYC_DOWNLOAD = 'ckyc_download',
  FACE_MATCH = 'face_match',
  EXPERIAN_HARD_PULL = 'Experian_Hard_Pull',
}

export enum EmailTemplate {
  APPROVED_PROCESS = 'approve_process_instant_fo',
  REJECTED_PROCESS = 'reject_process',
  NOT_REQUIRED = 'not_required',
  SANCTION_PAYDAY = 'sanction_letter_payday',
  SANCTION_EMI = 'sanction_letter_emi',
  OTP = 'otp',
  LOAN_SELFIE_CONSENT_DOC = 'loan_selfie_consent_doc',
  REFERRAL_SIGNUP = 'referral_signup',
  WITHDRAWAL_PROCESSED = 'withdrawal_processed',
  EMAIL_CHANGE = 'email_change'
}
export enum CallType {
  IVR = 'IVR',
}

export enum assignMacAddressDefault {
  userName = 'ramfincorphr',
  password = 'Monday@110005@#',
}

export enum BranchName {
  DELHI = 'Delhi',
}

export const adminFeeInPercentage = 10
