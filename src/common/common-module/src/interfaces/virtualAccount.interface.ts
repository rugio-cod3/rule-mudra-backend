export interface IVirtualAccount {
  accID: number
  customerID: string
  leadID: number
  accounID: string
  name: string
  customer_id: string
  recid: string
  entity: string
  ifsc: string
  bankName: string
  recName: string
  account_number: string
  credatedDate: Date
  uid: string
  iu_date?: Date
}
export type TSelectVirtualAccount = keyof IVirtualAccount
