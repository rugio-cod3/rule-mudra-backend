export interface IEMITransaction {
  transaction_id: number
  order_id: string
  emi_id: number
  interest: number
  principal: number
  penalty: number
  dpd_amount: number
  transaction_date: Date
  lead_id: number
  emi_status: string
}
