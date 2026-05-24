export interface IOnlinePayment {
  pID?: number
  name: string
  email: string
  phone: string
  service: string
  typeProduct: string
  toValue: string
  message: string
  razorpayOrderId: string
  razorpayPaymentId: string
  paymentStatus: string
  makerstamp?: Date
  updatestamp?: Date
  status: string
  approved_id?: number
  paymentType: string
  method: string
  leadID?: number
  device?: string
}

export type TSelectOnlinePayment = keyof IOnlinePayment
