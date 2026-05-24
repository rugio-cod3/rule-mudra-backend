export enum NameSimilarityStatus {
  ACCEPT = "ACCEPT",
  REJECT = "REJECT",
}

export enum NameMatchType {
  PENNY_DROP_PAN = "penny drop - pan",
  PENNY_DROP_AADHAR = "penny drop - aadhar",
  BANK_NAME_PAN = "bank account - pan",
  BANK_NAME_AADHAR = "bank account - aadhar",
  BANK_VERIFY_NAME_PAN = "verify bank account - pan",
  BANK_VERIFY_NAME_AADHAAR = "verify bank account - aadhaar",
  AADHAAR_PAN_DOB_DIGILOCKER = "DigilockerAadhaarDob - DigilockerPanDob",
  AADHAAR_PAN_NAME_DIGILOCKER = "DigilockerAadhaarName - DigilockerPanName",
  AADHAAR_PAN_NAME_EMPLOYMENT = "EmploymentAadhaarName - EmploymentPanName",
  AADHAAR_PAN_DOB_EMPLOYMENT = "EmploymentAadhaarDob - EmploymentPanDob",
  SAVE_BANK_NAME_PAN = "SaveBank Name - PAN Name",
  SAVE_BANK_NAME_AADHAAR = "SaveBank Name - AADHAAR Name",
  FINBOX_BANK_NAME_PAN = "Finbox Name - PAN Name",
  FINBOX_BANK_NAME_AADHAAR = "Finbox Name - Aadhaar Name",
}
