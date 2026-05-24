export interface ISubscriptionRefund {
  id: number
  pg_refund_id: string
  amount: number
  payment_id: string
  status: string
  subscriptionId: number
  customerID: number
  createdAt: Date
  updatedAt: Date
}
