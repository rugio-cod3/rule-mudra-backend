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
  CKYC_DOWNLOAD = 'CKYC_DOWNLOAD',
  CKYC_SEARCH = 'CKYC_SEARCH',
}

export enum ApiSupplierType {
  SUREPASS = 4,
  DECENTRO = 1,
  CIBIL = 3,
  FACE_MATCH = 5,
}
