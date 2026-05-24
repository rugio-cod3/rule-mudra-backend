export interface IRecipient {
  mobiles: string
  OTP: string
}

export interface ICreateOTP {
  id?: number
  mobile: number
  req_id: string
  otp: string
  isVerified?: boolean
  created_at?: Date
}
export type TSelectICreateOTP = keyof ICreateOTP


export interface IVerifyOTP {
  mobile: number
  req_id: string
  otp: string
  isVerified?: boolean
  androidId?: string,
  firebaseToken?: string,
}
export type TSelectIVerifyOTP = keyof IVerifyOTP
export interface IData {
  template_id: string
  short_url: string
  recipients: IRecipient[]
  //data?: object
}
export interface IMsg91OTP {
  message: string
  type: string
}

export interface IMsg91OTPResponse {
  data: IMsg91OTP
  success: boolean
  statusCode: number
}

export interface IKaleyraResponse {
  body?: string
  sender?: string
  type?: string
  source?: string
  template_id?: string
  id?: string
  createdDateTime?: string
  totalCount?: number
  data?: Array<{
    message_id?: string
    recipient?: string
  }>
  code?: string
  message?: string
  error?: {
    balance?: string
  }
}
