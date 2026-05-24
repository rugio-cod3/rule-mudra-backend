export interface ISurepassEsignInitiateRequestPayload {
  callback_url: string;
  customerID: number;
}

export interface ISurepassEsignInitiateResponse {
  status_code?: number;
  message_code?: string;
  message: string;
  success: boolean;
  data?: {
    client_id: string;
    group_id?: string;
    token: string;
    url: string;
  };
}

export interface ISurepassEsignStatusResponse {
  status_code?: number;
  message_code?: string;
  message: string;
  success: boolean;
  data?: {
    client_id: string;
    status?: string;
    completed: boolean;
    esign_error: boolean;
    error_message_from_nsdl: string;
  };
}

export interface ISurepassEsignReportResponse {
  status_code?: number;
  message_code?: string;
  message: string;
  success: boolean;
  data?: {
    client_id: string;
    status?: string;
    name_match?: {
      name?: string;
      name_matched?: boolean;
      name_match_score?: string;
      aaadhar_last_four_digits?: string;
      year_of_birth?: string;
      gender?: string;
    };
  };
}

export interface ISurepassEsignDocResponse {
  status_code?: number;
  message_code?: string;
  message: string;
  success: boolean;
  data?: {
    url: string;
  };
}

export interface ISurepassEsignAuditTrailResponse {
  status_code?: number;
  message_code?: string;
  message: string;
  success: boolean;
  data?: {
    url: string;
  };
}
