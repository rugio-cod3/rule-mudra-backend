export interface IGetCustomerBankAccountsPayload {
  leadID: number;
  customerID: number;
  emandateRequired: "1" | "0";
}

export interface IConfirmBankAccountPayload {
  leadID?: number;
  loan_id?: number;
  customerID: number;
  mandate_id: number;
  emandateRequired: "1" | "0";
  account_id: number;
}

export interface ISaveBankAccountPayload {
  account_holders_name: string;
  account_no: string;
  ifsc: string;
  bank_name: string;
  loan_id: number;
  confirmed_account_no: string;
  account_status?: string;
}

export interface IBankNameMatch {
  pancard: string;
  aadharNo: string;
  accountHoldersName: string;
  mobile: string;
  customerID: number;
  leadID: number;
}
