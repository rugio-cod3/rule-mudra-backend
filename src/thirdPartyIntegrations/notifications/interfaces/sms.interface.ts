export interface ISendSmsPayload {
  mobile: string;
  otp?: string;
  body_message: string;
  template_id: string;
  entityID?: string;
  vendor: ThirdPartAPI;
}

export interface ISmsResponse {
  data: any;
  message: string;
  statusCode: number;
}

export interface ISmsLogData {
  mobile: string;
  templateID: string;
  api_request: string;
  api_response: string;
  entityID: string;
}

export interface IKaleyraLogData {
  mobile: string;
  req_url: string;
  api_request: string | null;
  api_response: string | null;
  curl_error: string | null;
  type: string;
  created_at: string;
}

export enum ThirdPartAPI {
  TEXTNATION = "TEXTNATION",
}

export enum MessageVendor {
  NIMBUSIT = "NIMBUSIT",
}
