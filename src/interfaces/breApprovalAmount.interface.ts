export interface IBreApprovalAmountModel {
  id?: number
  customerID: number
  leadID: number
  type: string
  amount: number
  created_at?: Date | string
}


export type TSelectApprovalAmount = keyof IBreApprovalAmountModel