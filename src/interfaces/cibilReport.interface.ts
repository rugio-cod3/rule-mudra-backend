export interface CibilReportServiceReqParams {
    leadId: number;
    customerId?: number;
  }
  export interface CustomerInfoReqParam {
    Name: {
      Forename: string;
      Surname: string;
    };
    IdentificationNumber: {
      IdentifierName: string;
      Id: string;
    };
    Address: {
      StreetAddress: string;
      City: string;
      PostalCode: number;
      Region: string;
      AddressType: string;
    };
    DateOfBirth: string;
    PhoneNumber: {
      Number: number;
    };
    Email: string;
    Gender: string;
  }
  export interface cityNameAndRegionCode {
    cityName: string;
    regionCode: string;
  }
  export interface CreditReportVerifyAuthAnsReqParams {
    leadId: number;
    userId: number;
    answer: VerifyAuthAnsReqParam;
  }
  export interface VerifyAuthAnsReqParam {
    IVAnswer: IVAnswer | IVAnswer[];
    ChallengeConfigGUID: string | number;
  }
  interface IVAnswer {
    questionKey: string | number;
    answerKey: string | number;
    UserInputAnswer?: string | number;
    resendOTP?: boolean;
    skipQuestion?: boolean;
  }
  export interface CreditReportServiceReqParams {
    userId: number;
    leadId?: number;
    securityCheck?: boolean;
    forceFetch?: boolean;
  }
  
