export interface ISubscriptionPayment {
  id: number
  customerID: number
  subscriptionId: number
  orderId: string
  paymentId: string
  amount: number
  gst: number
  totalAmount: number
  status: string
  response: string
  createdAt: Date
  updatedAt: Date
}

export type TSelectSubscriptionPayment = keyof ISubscriptionPayment
