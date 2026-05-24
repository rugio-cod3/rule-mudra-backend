import { StepName } from "./common.enum";

export enum StepProvider {
  NEW_EXISTING = 'New/Existing Customer',
  REPEAT_CUSTOMER = 'Repeat Customer',
  GENERIC = 'Generic',
}

export const profileDetailsStep = [
  StepName.LOAN_PURPOSE,
  StepName.LOAN_AMOUNT,
  StepName.GENDER,
  StepName.MARITAL_STATUS,
  StepName.HIGHEST_EDUCATION,
  StepName.EMPLOYMENT_DETAILS,
  StepName.MODE_OF_PAYMENT,
  StepName.COMPANY_NAME,
  StepName.INDUSTRY,
  StepName.DESIGNATION,
  StepName.MONTHLY_INCOME,
  StepName.WORK_EXPERIENCE,
  StepName.SALARY_DATE,
  StepName.RESIDENCE_TYPE,
  StepName.ADDRESS_CONFIRMATION,
]

export enum LeadSteps {
  NAME_AND_EMAIL = 'Common 1/3',
  PAN_VERIFICATION = 'Common 2/3',
  PAN_CONFIRMATION = 'Long 1/29',
  GENERATE_AADHAR_OTP = 'Long 2/29',
  AADHAR_VERIFY_OTP ='Long 3/29',
  LOAN_PURPOSE = 'Long 5/29',
  LOAN_AMOUNT = 'Long 6/29',
  GENDER = 'Long 7/29',
  MARITAL_STATUS = 'Long 8/29',
  HIGHEST_EDUCATION = 'Long 9/29',
  EMPLOYMENT_DETAILS = 'Long 10/29',
  MODE_OF_PAYMENT = 'Long 11/29',
  COMPANY_NAME = 'Long 12/29',
  INDUSTRY = 'Long 13/29',
  DESIGNATION = 'Long 14/29',
  MONTHLY_INCOME = 'Long 15/29',
  WORK_EXPERIENCE = 'Long 16/29',
  SALARY_DATE = 'Long 17/29',
  RESIDENCE_TYPE = 'Long 18/29',
  ADDRESS_CONFIRMATION = 'Long 20/29',
}