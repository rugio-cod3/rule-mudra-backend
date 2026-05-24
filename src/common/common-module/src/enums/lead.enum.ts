import config from '@/config/default'
export enum LeadStatus {
  FRESH_LEAD = 'Fresh Lead',
  CALLBACK = 'Callback',
  INTERESTED = 'Interested',
  NOT_INTERESTED = 'Not Interested',
  WRONG_NUMBER = 'Wrong Number',
  DOCUMENT_RECEIVED = 'Document Received',
  APPROVED = 'Approved',
  HOLD = 'Hold',
  DISBURSAL_SHEET_SEND = 'Disbursal Sheet Send',
  DISBURSED = 'Disbursed',
  CLOSED = 'Closed',
  PART_PAYMENT = 'Part Payment',
  SETTLEMENT = 'Settlement',
  INCOMPLETE_DOCUMENTS = 'Incomplete Documents',
  DNC = 'DNC',
  REJECTED = 'Rejected',
  NOT_ELIGIBLE = 'Not Eligible',
  DUPLICATE = 'Duplicate',
  OTHER = 'Other',
  NO_ANSWER = 'No Answer',
  EMI_PAID = 'EMI Paid',
  LESS_SALARY = 'Less Salary',
  OUT_OF_RANGE = 'Out of Range',
  EMI_PRECLOSE = 'EMI PRECLOSE',
  BANK_UPDATE_REJECTED = 'Bank Update Rejected',
  APPROVED_PROCESS = 'Approved Process',
  REJECTED_PROCESS = 'Rejected Process',
  HOLD_PROCESS = 'Hold Process',
  NOT_REQUIRED = 'Not Required',
  NOT_REQUIRED_PROCESS = 'Not Required Process',
  BLACK_LISTED = 'Blacklisted',
  WHITE_LISTED = 'Whitelisted',
  DISBURSAL_APPROVED = 'Disbursal Approved',
  BANK_UPDATE_HOLD = 'Bank Update Hold',
  INCOMPLETE = 'Incomplete',
  INCOMPLETE_USER = 'Incomplete User',
}

export enum TotalExperience {
  ZERO_TO_TWO = '0 - 2 Years',
  TWO_TO_FIVE = '2 - 5 Years',
  FIVE_TO_EIGHT = '5 - 8 Years',
  EIGHT_TO_TEN = '8 - 10 Years',
  MORE_THAN_TEN = 'More than 10 years',
}

export enum Designation {
  ASSOCIATE = 'Associate',
  EXCECUTIVE = 'Executive',
  MANAGER = 'Manager',
  SENIOR_MANAGER = 'Senior Manager',
  CEO = 'CEO',
  OTHER = 'Other',
}

export enum Industry {
  IT = 'Information Technology (IT)',
  HEALTHCARE = 'Healthcare',
  EDUCATION = 'Education',
  AUTOMOTIVE = 'Automotive',
  E_COMMERCE = 'E-commerce',
  HOSPITALITY = 'Hospitality',
  OTHER = 'Other',
}

export enum SalaryMode {
  BANK_TRANSFER = 'Bank Transfer',
  CHEQUE = 'Cheque',
  CASH = 'Cash',
}

export enum AddressType {
  PERMANENT_ADDRESS = 'Permanent Address',
  CURRENT_ADDRESS = 'Current Address',
  RENT = 'Rent',
  OWNED = 'Owned',
}

export enum AddressStatus {
  VERIFIED = 'Verified',
  NOT_VERIFIED = 'Not Verified',
}
export enum ReferenceRelation {
  MOTHER = 'Mother',
  FATHER = 'Father',
  BROTHER = 'Brother',
  SISTER = 'Sister',
  SPOUSE = 'Spouse',
  RELATIVE = 'Relative',
  FRIEND = 'Friend',
}
export enum UploadPlatform {
  LOCAL = 'local',
  S3 = 'S3',
}

export const sampleReferencePayload = {
  address: 'N/A',
  city: 'N/A',
  state: 'N/A',
  pincode: 0,
  createdBy: +config.defaultUserId,
}
export enum ProductID {
  EMI = 1,
  PAYDAY = 2,
  EXPERIAN = 3,
}

export enum LeadType {
  NEW_CASE = 'New Case',
  REPEAT_CASE = 'Repeat Case',
  EXISTING_CASE = 'Existing Case',
}
