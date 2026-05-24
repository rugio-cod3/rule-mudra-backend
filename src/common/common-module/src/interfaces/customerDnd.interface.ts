import { IPaginate } from './common.interface'

export interface ICustomerDnd {
  id?: number // Auto-increment primary key
  name: string
  customerID: number
  mobile: number
  reason: string
  start_date: Date
  expiry_date: Date
  created_at?: Date | null
  updated_at?: Date | null
  pancard?: string | null
  updated_by?: number | 0
  is_deleted?: string | 0
  removed_by?: number | null
  updatedName?: string | null
  removedName?: string | null
}

export type TSelectCustomerDnd = keyof ICustomerDnd

export interface ISetDndPayload {
  name: string
  mobile: number
  pancard: string
  reason: string
  start_date: Date
  expiry_date: Date
  updated_by: number
}

export interface IGetDndPayload extends IPaginate {
  name?: string
  mobile?: number
  pancard?: string
  reason?: string
  start_date?: Date
  expiry_date?: Date
  is_deleted?: string
  removed_by?: number
  isExcelDownload?: string
}

export interface IWhereData {
  name?: string
  mobile?: number
  reason?: string
  is_deleted?: string
}

export interface IDateRange {
  start_date?: Date
  expiry_date?: Date
}

export interface IDeleteDndPayload {
  customerID: number
  removed_by: number
}

export interface IUpdateDndPayload {
  id: number
  expiry_date: Date
  updated_by: number
}
