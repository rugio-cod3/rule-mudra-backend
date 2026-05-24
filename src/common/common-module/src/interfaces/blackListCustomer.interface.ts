
export interface ICustomerBlackListModel {
  id?: number // int
  customerid: number // bigint
  leadid: number // bigint
  email: string // varchar(256)
  mobile: number // bigint
  date: Date // timestamp
  uid: number // bigint
  lead_status?: string // varchar(255)
  message?: string // text
  iu_date?: Date // timestamp
}

export interface IBlacklistPageName {
  pageName: string
  page?: number
  limit?: number
  mobile?: number
  pancard?: string
}

export type TSelectCustomerBlackList = keyof ICustomerBlackListModel
