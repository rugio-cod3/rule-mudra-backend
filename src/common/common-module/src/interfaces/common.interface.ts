export interface IEmailPayload {
  sender: {
    name: string
    email: string
  }
  to: {
    email: string
    name: string
  }[]
  subject: string
  htmlContent: string
}

export interface IPagination {
  skip: number
  take: number
}

export interface IPaginate {
  page?: number
  limit?: number
}

export interface IivrMenuOnePayload {
  mobile: bigint
}

export interface IivrMenuTwoPayload {
  mobile: bigint
  press: number
}

export interface ICustomerDetailsPayload {
  mobile: bigint
}

export interface IexperianUserDetailsPayload {
  leadID: number
  customerID: number
}

export interface IexperianCrmDetailsPayload {
  leadID: number
}
export interface IexperianBureauDetailsPayload {
  leadID: number
  customerID: number
  customerToken: string
}
export interface IPaydayIpc {
  totalRepayAmount: number
  totalInterest: number
  charges: number
  principalAmount: number
}
export interface IEmailPayload {
  sender: {
    name: string
    email: string
  }
  to: {
    email: string
    name: string
  }[]
  subject: string
  htmlContent: string
}

export interface IPagination {
  skip: number
  take: number
}

export interface IPaginate {
  page?: number
  limit?: number
}

export interface IivrMenuOnePayload {
  mobile: bigint
}

export interface IivrMenuTwoPayload {
  mobile: bigint
  press: number
}

export interface ICustomerDetailsPayload {
  mobile: bigint
}

export interface IExperianUserDetailsPayload {
  leadID: number
  customerID: number
}

export interface IExperianCrmDetailsPayload {
  leadID: number
}
export interface IExperianBureauDetailsPayload {
  user_id: number
  loan_id: number
}

interface IHeader {
  SystemCode: string
  MessageText: string
  ReportDate: string
  ReportTime: string
}

interface IUserMessage {
  UserMessageText: string
}

export interface ICreditProfileHeader {
  Enquiry_Username: string
  ReportDate: string
  ReportTime: string
  Version: string
  ReportNumber: string
  Subscriber: string
  Subscriber_Name: string
}

interface IPerson {
  Surname: string
  FirstName: string
  MiddleName1?: string
  MiddleName2?: string
  MiddleName3?: string
  GenderCode: number
  IncomeTaxPAN: string
  PANIssueDate?: string
  PANExpirationDate?: string
  PassportNumber?: string
  PassportIssueDate?: string
  PassportExpirationDate?: string
  VoterIdentityCard?: string
  VoterIDIssueDate?: string
  VoterIDExpirationDate?: string
  DriverLicenseNumber?: string
  DriverLicenseIssueDate?: string
  DriverLicenseExpirationDate?: string
  RationCardNumber?: string
  RationCardIssueDate?: string
  RationCardExpirationDate?: string
  UniversalIDNumber?: string
  UniversalIDIssueDate?: string
  UniversalIDExpirationDate?: string
  DateOfBirth: string
  STDPhoneNumber?: string
  PhoneNumber: string
  TelephoneExtension?: string
  TelephoneType?: string
  MobilePhone?: string
  EMailId: string
}

interface IApplicant extends IPerson { }

interface IAddress {
  FlatNoPlotNoHouseNo: string
  BldgNoSocietyName: string
  RoadNoNameAreaLocality: string
  City: string
  Landmark: string
  State: string | number
  PinCode: string
}

interface IApplicantAddress extends IAddress { }

interface ICurrentApplicationDetails {
  Enquiry_Reason: string
  Finance_Purpose: string
  AmountFinanced: string
  Duration_Of_Agreement: string
  Current_Applicant_Details: IApplicant
  Current_Applicant_Address_Details: IApplicantAddress
}

interface ICurrentApplication {
  Current_Application_Details: ICurrentApplicationDetails
}

interface ICreditAccountSummary {
  CreditAccountTotal: string
  CreditAccountActive: string
  CreditAccountDefault: string
  CreditAccountClosed: string
  CADSuitFiledCurrentBalance: string
}

interface ITotalOutstandingBalance {
  Outstanding_Balance_Secured: string
  Outstanding_Balance_UnSecured: string
  Outstanding_Balance_All: string
}

interface ICAISAccountHistory {
  Year: string
  Month: string
  Days_Past_Due: string
  Asset_Classification: string
}

interface ICAISHolderDetails {
  Surname_Non_Normalized: string
  First_Name_Non_Normalized: string
  Middle_Name_1_Non_Normalized: string
  Middle_Name_2_Non_Normalized: string
  Middle_Name_3_Non_Normalized: string
  Alias: string
  Gender_Code: string
  Income_TAX_PAN: string
  Date_of_birth: string
}

interface ICAISHolderAddressDetails {
  First_Line_Of_Address_non_normalized: string
  Second_Line_Of_Address_non_normalized: string
  Third_Line_Of_Address_non_normalized: string
  City_non_normalized: string
  Fifth_Line_Of_Address_non_normalized: string
  State_non_normalized: string
  ZIP_Postal_Code_non_normalized: string
  CountryCode_non_normalized: string
  Address_indicator_non_normalized: string
  Residence_code_non_normalized: string
}

interface ICAISHolderPhoneDetails {
  Telephone_Number: string
  Telephone_Type: string
}

interface ICAISHolderIDDetails {
  Income_TAX_PAN: string
  PAN_Issue_Date: string
  PAN_Expiration_Date: string
  Driver_License_Number: string
  Driver_License_Issue_Date: string
  Driver_License_Expiration_Date: string
  EMailId: string
}

export interface ICAISAccountDetails {
  Identification_Number: string
  Subscriber_Name: string
  Account_Number: string
  Portfolio_Type: string
  Account_Type: string
  Open_Date: string
  Highest_Credit_or_Original_Loan_Amount: string
  Terms_Duration: string
  Terms_Frequency: string
  Scheduled_Monthly_Payment_Amount: string
  Account_Status: string
  Payment_Rating: string
  Payment_History_Profile: string
  Special_Comment: string
  Current_Balance: string
  Amount_Past_Due: string
  Original_Charge_off_Amount: string
  Date_Reported: string
  Date_Of_First_Delinquency: string
  Date_Closed: string
  Date_of_Last_Payment: string
  SuitFiledWillfulDefaultWrittenOffStatus: string
  SuitFiled_WilfulDefault: string
  Written_off_Settled_Status: string
  Value_of_Credits_Last_Month: string
  Occupation_Code: string
  Settlement_Amount: string
  Value_of_Collateral: string
  Type_of_Collateral: string
  Written_Off_Amt_Total: string
  Written_Off_Amt_Principal: string
  Rate_of_Interest: string
  Repayment_Tenure: string
  Promotional_Rate_Flag: string
  Income: string
  Income_Indicator: string
  Income_Frequency_Indicator: string
  DefaultStatusDate: string
  LitigationStatusDate: string
  WriteOffStatusDate: string
  DateOfAddition: string
  CurrencyCode: string
  Subscriber_comments: string
  Consumer_comments: string
  AccountHoldertypeCode: string
  CAIS_Account_History: ICAISAccountHistory[]
  CAIS_Holder_Details: ICAISHolderDetails | {}
  CAIS_Holder_Address_Details: ICAISHolderAddressDetails | {}
  CAIS_Holder_Phone_Details: ICAISHolderPhoneDetails | {}
  CAIS_Holder_ID_Details: ICAISHolderIDDetails | {}
}

interface ICAISSummary {
  Credit_Account: ICreditAccountSummary
  Total_Outstanding_Balance: ITotalOutstandingBalance
}

interface INProfileResponse {
  Header: IHeader
  UserMessage: IUserMessage
  CreditProfileHeader: ICreditProfileHeader | {}
  Current_Application: ICurrentApplication
  CAIS_Account: {
    CAIS_Summary: ICAISSummary
    CAIS_Account_DETAILS: ICAISAccountDetails[] | ICAISAccountDetails | string | null
  }
  Match_result: {
    Exact_match: string
  }
  SCORE: {
    BureauScore: string
    BureauScoreConfidLevel: string
    CreditRating: string
  }
}

export interface IExperianResponse {
  INProfileResponse: INProfileResponse
}

export interface IExperianRequestConfig {
  method: string
  url: string
  headers: Record<string, string>
  data: string
}

interface IDetails {
  Income: string
  MaritalStatus: string
  EmployStatus: string
  TimeWithEmploy: string
  NumberOfMajorCreditCardHeld: string
}

interface IIdentification {
  XMLUser: string
  XMLPassword: string
}

interface IApplication {
  FTReferenceNumber: string
  CustomerReferenceID: string
  EnquiryReason: string
  FinancePurpose: string
  AmountFinanced: string
  DurationOfAgreement: string
  ScoreFlag: string
  PSVFlag: string
}

interface ISoapRequestBody {
  INProfileRequest: {
    Identification: IIdentification
    Application: IApplication
    Details: IDetails
    Applicant: IApplicant
    Address: IApplicantAddress
    AdditionalAddressFlag: { Flag: string }
    AdditionalAddress: Partial<IApplicantAddress>
  }
}

export interface IExperianSoapRequest {
  'soapenv:Envelope': {
    $: {
      'xmlns:soapenv': string
      'xmlns:urn': string
    }
    'soapenv:Header': {}
    'soapenv:Body': {
      'urn:process': {
        'urn:in': ISoapRequestBody
      }
    }
  }
}

export interface IExperianHardPullGetRequest {
  EXPERIAN_HARDPULL_URL: string
  EXPERIAN_HARDPULL_METHOD: string
  EXPERIAN_HARDPULL_PASSWORD: string
  EXPERIAN_HARDPULL_USERNAME: string
  EXPERIAN_HARDPULL_CONTENT_TYPE: string
  EXPERIAN_HARDPULL_COOKIE: string
}
