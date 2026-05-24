export interface ICreateLoginOTP {
  id?: number;
  mobile_no: number;
  request_id: string;
  otp: string;
  vender_id: number;
  created_at?: Date;
  expiresAt: Date;
  mobile_enc?: string;
}

export type TSelectICreateLoginOTP = keyof ICreateLoginOTP;
