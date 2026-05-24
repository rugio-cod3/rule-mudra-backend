import { StepName } from "./common.enum";

export enum StepProvider {
  NEW = "New",
  EXISTING = "Existing",
  REPEAT_CUSTOMER = "Repeat",
  GENERIC = "Generic",
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
];
