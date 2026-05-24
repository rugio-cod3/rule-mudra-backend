export interface IBankUpdateCheckModel {
  id?: number
  customerID: number
  leadID: number
  data: string
}

export type TSelectBankUpdateCheck = keyof IBankUpdateCheckModel
