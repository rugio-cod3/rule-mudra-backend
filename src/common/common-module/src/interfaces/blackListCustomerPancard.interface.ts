// interfaces/blackListCustomerPancard.interface.ts
export interface IBlacklistCustomerPancard {
  id?: number
  pancard: string
  status: string
  addBy: number
  addDate?: string
  removeBy?: number | null
  removeDate?: string | null
  createdDate?: string
}

export type TBlackListCustomerPancard = keyof IBlacklistCustomerPancard
