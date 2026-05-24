
export interface IOnlinePaymentLog {
  id?: number;
  pID: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentStatus: string;
  createdDate?: Date;
  payload?: string;
  razorpay_amount?: number;
  iu_date?: Date;
}
export type TSelectOnlinePaymentLog = keyof IOnlinePaymentLog

