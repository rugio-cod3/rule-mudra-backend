export interface IExperianPullResponse {
  status: number
  message: string
  data: {
    data: object
    errorString?: string
    stageOneId_: number
    stageTwoId_: number
  }
}

export interface IGetQuestionExperianResponse {
  success?: boolean
  statusCode?: number
  data: {
    questionToCustomer: {
      question: string
      type: string
      qid: number
      optionsSet1: object
      optionsSet2: object
    }
    stgOneHitId: number
    stgTwoHitId: number
    errors?: Array<{
      code: number
      message: string
    }>
  }  
}

export interface IPostAnswerOfExperianResponse {
  data: {
    questionToCustomer: {
      question: string
      type: string
      qid: number
      optionsSet1: object
      optionsSet2: object
    }
    stgOneHitId: number
    stgTwoHitId: number
    responseJson:string;
    showHtmlReportForCreditReport:null | boolean
  }
  status: number
  message: string
}

interface Header {
  SystemCode: string;
  MessageText?: any;
  ReportDate: string;
  ReportTime: string;
}

interface UserMessage {
  UserMessageText: string;
}

interface CreditProfileHeader {
  Enquiry_Username: string;
  ReportDate: string;
  ReportTime: string;
  Version: string;
  ReportNumber: string;
  Subscriber?: any;
  Subscriber_Name: string;
}

interface CurrentApplicantDetails {
  Last_Name: string;
  First_Name: string;
  Middle_Name1?: any;
  Middle_Name2?: any;
  Middle_Name3?: any;
  Gender_Code: string;
  IncomeTaxPan: string;
  PAN_Issue_Date?: any;
  PAN_Expiration_Date?: any;
  Passport_number?: any;
  Passport_Issue_Date?: any;
  Passport_Expiration_Date?: any;
  Voter_s_Identity_Card?: any;
  Voter_ID_Issue_Date?: any;
  Voter_ID_Expiration_Date?: any;
  Driver_License_Number?: any;
  Driver_License_Issue_Date?: any;
  Driver_License_Expiration_Date?: any;
  Ration_Card_Number?: any;
  Ration_Card_Issue_Date?: any;
  Ration_Card_Expiration_Date?: any;
  Universal_ID_Number?: any;
  Universal_ID_Issue_Date?: any;
  Universal_ID_Expiration_Date?: any;
  Date_Of_Birth_Applicant: string;
  Telephone_Number_Applicant_1st?: any;
  Telephone_Extension?: any;
  Telephone_Type?: any;
  MobilePhoneNumber: string;
  EMailId: string;
}

interface CurrentOtherDetails {
  Income: string;
  Marital_Status?: any;
  Employment_Status?: any;
  Time_with_Employer?: any;
  Number_of_Major_Credit_Card_Held?: any;
}

interface CurrentApplicantAddressDetails {
  FlatNoPlotNoHouseNo: string;
  BldgNoSocietyName?: any;
  RoadNoNameAreaLocality?: any;
  City: string;
  Landmark?: any;
  State: string;
  PINCode: string;
  Country_Code: string;
}

interface CurrentApplicationDetails {
  Enquiry_Reason: string;
  Finance_Purpose?: any;
  Amount_Financed: string;
  Duration_Of_Agreement: string;
  Current_Applicant_Details: CurrentApplicantDetails;
  Current_Other_Details: CurrentOtherDetails;
  Current_Applicant_Address_Details: CurrentApplicantAddressDetails;
  Current_Applicant_Additional_AddressDetails?: any;
}

interface CurrentApplication {
  Current_Application_Details: CurrentApplicationDetails;
}

interface CreditAccount {
  CreditAccountTotal: string;
  CreditAccountActive: string;
  CreditAccountDefault: string;
  CreditAccountClosed: string;
  CADSuitFiledCurrentBalance: string;
}

interface TotalOutstandingBalance {
  Outstanding_Balance_Secured: string;
  Outstanding_Balance_Secured_Percentage: string;
  Outstanding_Balance_UnSecured: string;
  Outstanding_Balance_UnSecured_Percentage: string;
  Outstanding_Balance_All: string;
}

interface CAIS_Summary {
  Credit_Account: CreditAccount;
  Total_Outstanding_Balance: TotalOutstandingBalance;
}

interface CAIS_Account_History {
  Year: string;
  Month: string;
  Days_Past_Due: string;
  Asset_Classification: string;
}

interface CAIS_Holder_Details {
  Surname_Non_Normalized: string;
  First_Name_Non_Normalized?: any;
  Middle_Name_1_Non_Normalized?: any;
  Middle_Name_2_Non_Normalized?: any;
  Middle_Name_3_Non_Normalized?: any;
  Alias?: any;
  Gender_Code: string;
  Income_TAX_PAN: string;
  Passport_Number?: any;
  Voter_ID_Number?: any;
  Date_of_birth: string;
}

interface CAIS_Holder_Address_Details {
  First_Line_Of_Address_non_normalized: string;
  Second_Line_Of_Address_non_normalized: string;
  Third_Line_Of_Address_non_normalized: string;
  City_non_normalized: string;
  Fifth_Line_Of_Address_non_normalized?: any;
  State_non_normalized: string;
  ZIP_Postal_Code_non_normalized: string;
  CountryCode_non_normalized: string;
  Address_indicator_non_normalized: string;
  Residence_code_non_normalized?: any;
}

interface CAIS_Holder_Phone_Details {
  Telephone_Number: string;
  Telephone_Type?: any;
  Telephone_Extension?: any;
  Mobile_Telephone_Number?: any;
  FaxNumber?: any;
  EMailId: string;
}

interface CAIS_Holder_ID_Details {
  Income_TAX_PAN: string;
  PAN_Issue_Date?: any;
  PAN_Expiration_Date?: any;
  Passport_Number?: any;
  Passport_Issue_Date?: any;
  Passport_Expiration_Date?: any;
  Voter_ID_Number?: any;
  Voter_ID_Issue_Date?: any;
  Voter_ID_Expiration_Date?: any;
  Driver_License_Number?: any;
  Driver_License_Issue_Date?: any;
  Driver_License_Expiration_Date?: any;
  Ration_Card_Number?: any;
  Ration_Card_Issue_Date?: any;
  Ration_Card_Expiration_Date?: any;
  Universal_ID_Number?: any;
  Universal_ID_Issue_Date?: any;
  Universal_ID_Expiration_Date?: any;
  EMailId?: any;
}

export interface ICAIS_Account_DETAILS {
  Identification_Number: string;
  Subscriber_Name: string;
  Account_Number: string;
  Portfolio_Type: string;
  Account_Type: string;
  Open_Date: string;
  Credit_Limit_Amount?: any;
  Highest_Credit_or_Original_Loan_Amount: string;
  Terms_Duration: string;
  Terms_Frequency?: any;
  Scheduled_Monthly_Payment_Amount?: any;
  Account_Status: string;
  Payment_Rating: string;
  Payment_History_Profile: string;
  Special_Comment?: any;
  Current_Balance: string;
  Amount_Past_Due: string;
  Original_Charge_Off_Amount?: any;
  Date_Reported: string;
  Date_of_First_Delinquency?: any;
  Date_Closed?: any;
  Date_of_Last_Payment: string;
  SuitFiledWillfulDefaultWrittenOffStatus?: any;
  SuitFiled_WilfulDefault?: any;
  Written_off_Settled_Status?: any;
  Value_of_Credits_Last_Month?: any;
  Occupation_Code?: any;
  Settlement_Amount?: any;
  Value_of_Collateral?: any;
  Type_of_Collateral?: any;
  Written_Off_Amt_Total?: any;
  Written_Off_Amt_Principal?: any;
  Rate_of_Interest?: any;
  Repayment_Tenure: string;
  Promotional_Rate_Flag?: any;
  Income?: any;
  Income_Indicator?: any;
  Income_Frequency_Indicator?: any;
  DefaultStatusDate?: any;
  LitigationStatusDate?: any;
  WriteOffStatusDate?: any;
  DateOfAddition: string;
  CurrencyCode: string;
  Subscriber_comments?: any;
  Consumer_comments?: any;
  AccountHoldertypeCode: string;
  CAIS_Account_History: CAIS_Account_History;
  CAIS_Holder_Details: CAIS_Holder_Details;
  CAIS_Holder_Address_Details: CAIS_Holder_Address_Details;
  CAIS_Holder_Phone_Details: CAIS_Holder_Phone_Details;
  CAIS_Holder_ID_Details: CAIS_Holder_ID_Details;
}

interface CAIS_Account {
  CAIS_Summary: CAIS_Summary;
  CAIS_Account_DETAILS: ICAIS_Account_DETAILS;
}

interface MatchResult {
  Exact_match: string;
}

interface TotalCAPSSummary {
  TotalCAPSLast7Days: string;
  TotalCAPSLast30Days: string;
  TotalCAPSLast90Days: string;
  TotalCAPSLast180Days: string;
}

interface CAPSSummary {
  CAPSLast7Days: string;
  CAPSLast30Days: string;
  CAPSLast90Days: string;
  CAPSLast180Days: string;
}

interface CAPS {
  CAPS_Summary: CAPSSummary;
}

interface NonCreditCAPSSummary {
  NonCreditCAPSLast7Days: string;
  NonCreditCAPSLast30Days: string;
  NonCreditCAPSLast90Days: string;
  NonCreditCAPSLast180Days: string;
}

interface NonCreditCAPS {
  NonCreditCAPS_Summary: NonCreditCAPSSummary;
}

interface SCORE {
  BureauScore: string;
  BureauScoreConfidLevel?: any;
}

export interface IExperianResponse {
  status: number
  message: string
  data:{
  Header: Header;
  UserMessage: UserMessage;
  CreditProfileHeader: CreditProfileHeader;
  Current_Application: CurrentApplication;
  CAIS_Account: CAIS_Account;
  Match_result: MatchResult;
  TotalCAPS_Summary: TotalCAPSSummary;
  CAPS: CAPS;
  NonCreditCAPS: NonCreditCAPS;
  SCORE: SCORE;
  errorString?: string
  stageOneId_?: number
  stageTwoId_?: number
  }

}
export interface IAccountFormateData {
  id?: number; // Primary key
  report_id?: number;
  profile_id?: number;
  customerID?: number;
  product_id?: number;
  opening_date?: Date;
  reporting_date?: Date;
  closing_date?: Date | null; // Nullable column
  last_payment?: Date | null; // Nullable column
  bank_name?: string;
  bank_id?: number;
  account_no?: string;
  loan_amount?: number;
  credit_limit?: number;
  current_balance?: number;
  overdue_bal?: number;
  account_type?: number;
  tenure?: number;
  roi?: string; 
  duration?: number;
  frequency?: string; 
  account_status?: number;
  holder_type?: number;
  on_time_payments?: number;
  due_date_payments?: number | null; // Nullable column
  addresses_json?: string; // Assuming JSON stored as a text
  holder_ids_json?: Record<string, any>;
  latest_account?: number;
  oldest_account?: number;
  created_by?: number;
  created_at?: Date;
  is_report_deleted?: string;
  updated_at?: Date | null;
}


export interface IPaymentHistory {
  profile_account_id: number;
  repayment_status: string;
  repayment_date: Date;
  account_type: number;
  customerID: number;
}

