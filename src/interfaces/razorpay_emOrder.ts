export interface IRazorpayEMOrder {
  id: number // Auto-incrementing primary key

  emID: number // varchar(216)
  customerID: number // varchar(216)
  leadID: number // varchar(216)
  orderID: string // varchar(216)
  entity: string // varchar(216)

  amount: string // varchar(216)
  amount_paid: string // varchar(216)
  amount_due: string // varchar(216)

  currency: string // varchar(216)
  receipt: string // varchar(216)
  remarks: string // varchar(512)
  status: string // varchar(216)

  notes_key_1: string // varchar(216)
  razorpay_payment_id: string // varchar(216)
  razorpay_order_id: string // varchar(216)
  razorpay_signature: string // varchar(216)
  tokenID: string // varchar(216)
  uid: string // varchar(216)

  createdDate: Date // datetime represented as Date object
}
