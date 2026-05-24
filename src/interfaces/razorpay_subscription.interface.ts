import { PaymentCheckoutStatus } from "@/enums/cibil.enum"

export interface IRazorpaySubscription {
  id: number // AI PK
  customerID: number
  startAt: Date
  endAt: Date
  status: PaymentCheckoutStatus
  cancelled_date: Date | null
  productID: number
  razorpay_response: string
  razorpay_subscription_id: string
  createdAt: Date
  updatedAt: Date
}

export interface IRazorPayCreateSubscription {
  customerID: number
  startAt: Date
  endAt: Date
  status: string
  productID: number
  razorpay_response: string
  razorpay_subscription_id: string
}

export type TSelectRazorpaySubscription = keyof IRazorpaySubscription
