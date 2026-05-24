export enum BranchName {
  DELHI = "Delhi",
  NOIDA = "Noida",
}

export enum ApiSupplierType {
  SUREPASS = 4,
  DECENTRO = 1,
  CIBIL = 3,
  FINBUD = 5,
  CREDFORGE = 6,
  FINBOX = 7,
  DIGITAP = 8,
}

export enum SurePassApiUrl {
  PAN_COMPREHENSIVE = "/api/v1/pan/pan-comprehensive",
  AADHAR_SEND_OTP = "/api/v1/aadhaar-v2/generate-otp",
  AADHAR_SUBMIT = "/api/v1/aadhaar-v2/submit-otp",
  AADHAR_INITIATE = "/api/v1/digilocker/initialize",
  EAADHAR = "api/v1/digilocker/status/",
}
export enum DigitapApiUrl {
  PAN_COMPREHENSIVE = "/kyc/v1/pan_details_plus",
}

export enum DecentroApiUrl {
  AADHAR_INITIATE = "/kyc/digilocker/initiate_session",
  EAADHAR = "/kyc/digilocker/eaadhaar",
  GET_ACCESS_TOKEN = "/kyc/digilocker/access_token/code",
}

export enum AddressType {
  PERMANENT_ADDRESS = "Permanent Address",
  CURRENT_ADDRESS = "Current Address",
  RENT = "Rent",
  OWNDED = "Owned",
}

export enum StepName {
  NAME_AND_EMAIL = "NAME_AND_EMAIL",
  PAN_VERIFICATION = "PAN_VERIFICATION",
  OTP_VERIFICATION = "OTP_VERIFICATION",
  PAN_CONFIRMATION = "PAN_CONFIRMATION",
  BASIC_DETAIL = "BASIC_DETAIL",
  AADHAR_CONFIRMATION = "AADHAR_CONFIRMATION",
  LOAN_PURPOSE = "LOAN_PURPOSE",
  LOAN_AMOUNT = "LOAN_AMOUNT",
  LOAN_APPROVAL = "LOAN_APPROVAL",
  GENDER = "GENDER",
  MARITAL_STATUS = "MARITAL_STATUS",
  HIGHEST_EDUCATION = "HIGHEST_EDUCATION",
  EMPLOYMENT_DETAILS = "EMPLOYMENT_DETAILS",
  MODE_OF_PAYMENT = "MODE_OF_PAYMENT",
  COMPANY_NAME = "COMPANY_NAME",
  INDUSTRY = "INDUSTRY",
  DESIGNATION = "DESIGNATION",
  MONTHLY_INCOME = "MONTHLY_INCOME",
  WORK_EXPERIENCE = "WORK_EXPERIENCE",
  SALARY_DATE = "SALARY_DATE",
  RESIDENCE_TYPE = "RESIDENCE_TYPE",
  ADDRESS_CONFIRMATION = "ADDRESS_CONFIRMATION",
  FINBOX = "FINBOX",
  REFERENCE_DETAILS = "REFERENCE_DETAILS",
  SELFIE_VERIFICATION = "SELFIE_VERIFICATION",
  BANK_DETAILS = "BANK_DETAILS",
  EMANDATE = "EMANDATE",
  PENNY_DROP = "PENNY_DROP",
  BANK_ACCOUNT_CONFIRMATION = "BANK_ACCOUNT_CONFIRMATION",
  KFS = "KFS",
  ONE_PAGE = "1_PAGE",
  LOAN_AMOUNT_CLOSED = "LOAN_AMOUNT_CLOSED",
  PAN_REVERIFY = "PAN_REVERIFY",
}

export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
}

export enum ReferenceRelation {
  MOTHER = "Mother",
  FATHER = "Father",
  BROTHER = "Brother",
  SISTER = "Sister",
  SPOUSE = "Spouse",
  RELATIVE = "Relative",
  FRIEND = "Friend",
}
export enum NotificationUrl {
  NEW_LOAN = "/notification/notificationService/newloan-sms",
  REPAYMENT_LINK = "/notification/notificationService/repaymentLink-sms",
}

export enum SurepassDigilockerApiUrl {
  STATUS = "/api/v1/digilocker/status",
  LIST = "/api/v1/digilocker/list-documents",
  DOWNLOAD = "/api/v1/digilocker/download-document",
}

export const adminFeeInPercentage = 10;
