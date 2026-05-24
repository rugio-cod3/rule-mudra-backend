export interface IFinboxSessionInitiateRequestPayload {
  link_id: string;
  from_date: string;
  to_date: string;
  redirect_url: string;
  customerID: string;
  session_expire?: boolean;
}

export interface IFinboxSessionInitiateResponse {
  status: boolean;
  message: string;
  data?: {
    session_id?: string;
    redirect_url?: string;
    retry?: boolean;
  };
}

export interface IFinboxInitiateProcessingResponse {
  status: boolean;
  message: string;
  data?: {
    session_id: string;
    upload_status?: string;
    session_progress?: string;
    insights_available?: boolean;
    accounts?: any;
    link_id?: string;
    aggregate_monthly_analysis?: string;
    aggregate_xlsx_report_url?: string;
  };
}

export interface IFinboxSessionUploadStatusResponse {
  status: boolean;
  message: string;
  data?: {
    upload_status: string;
    session_id: string;
    accounts?: [];
  };
}

export interface IFinboxSessionProgressResponse {
  status: boolean;
  message: string;
  data: {
    session_id: string;
    session_progress?: string;
    progress?: ISessionProgress[];
  };
}

interface ISessionProgress {
  identity_status: string;
  transaction_status: string;
  processing_status: string;
  fraud_status: string;
  statement_id: string;
  message: any;
  source: string;
}

export interface IFinboxSessionStatusResponse {
  status: boolean;
  message: string;
  data?: {
    session_id: string;
    insights_available?: boolean;
    accounts?: ISessionStatusAccounts[];
  };
}

interface ISessionStatusAccounts {
  account_id: string;
  account_number: string;
  bank_name: string;
  error_code: any;
  error_message: any;
  account_status: string;
  created_at: string;
  last_updated_at: string;
  statements: ISessionStatusAccountStatements[];
}

interface ISessionStatusAccountStatements {
  statement_id: string;
  statement_status: string;
  error_code: any;
  error_message: any;
  source: string;
  upload_file_name: string;
  statement_date_range: any;
  created_at: string;
}

export interface IFinboxSessionBankConnectPayload {
  entityId: string;
  loan_id: number;
  customerID: string;
  provider?: "finbox" | "digitap";
  txn_id: string;
}
