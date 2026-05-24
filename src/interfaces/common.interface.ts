export interface IEmailPayload {
  sender: {
    name: string;
    email: string;
  };
  to: {
    email: string;
    name: string;
  }[];
  subject: string;
  htmlContent: string;
}

export interface IPagination {
  skip: number;
  take: number;
}

export interface IivrMenuOnePayload {
  mobile: bigint;
}

export interface IivrMenuTwoPayload {
  mobile: bigint;
  press: number;
}

export interface ICustomerDetailsPayload {
  mobile: bigint;
}

export interface IGetBankDetailsPayload {
  ifsc: string;
}

export interface IUtmSource {
  utm_source: string;
}
export interface ILoanVerification {
  mobile: bigint;
  loanlastfourdigit: number;
}
export interface IApiResponseSms {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: {
      status: string;
      message: string;
      data: {
        status: string;
        data: {
          [key: string]: Array<{
            id: string;
            mobile: string;
            status: string;
          }>;
        };
        group_id: number;
      };
    };
  };
}

export interface ILeadStatus {
  mobile: bigint;
}
export interface IDisbursalStatusResponse {
  status: string;
  mobile: bigint;
  disbursalAmount?: number;
  accountNo?: string;
  bank?: string;
  disbursalDate?: Date;
}

export interface ICheckAndApplyTemporaryWaiverPayday {
  lead: {
    ipc: number;
    productID: number;
    customerID: number;
    leadID: number;
  };
  remainingAmount: number;
  payingAmount: number;
  waiverReference: string;
}

export interface IUserTransactions {
  loan_id: string;
}

export interface IRazorpayRepayment {
  leadId: number;
  amount: number;
}
