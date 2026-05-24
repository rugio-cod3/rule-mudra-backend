export interface IBankListModel {
  id?: number
  bankName: string
  pngLogo?: string
  svgLogo?: string
  pngIcon?: string
  svgIcon?: string
  bank_link?: string
  created_at?: Date
  created_by?: number
}

export type TSelectBankList = keyof IBankListModel