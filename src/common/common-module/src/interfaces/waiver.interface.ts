import { Products } from '../enums/product.enum'
import { WaiverStatus, WaiverType } from '../enums/waiver.enum'

export interface IWaiver {
  id: number
  lead_id: number
  customer_id: number
  collection_id: number
  emi_id?: number
  credit_id?: number
  amount: number
  product: Products
  expiration_time?: string
  type: WaiverType
  remarks?: string
  is_paid?: boolean
  status?: WaiverStatus
  created_by: number
  updated_by?: number
  created_at?: string
  updated_at?: string
  approved_date?: string
}

export type TSelectWaiver = keyof IWaiver

export interface ICreateWaiverPayload {
  amount: number
  type: WaiverType
  remarks: string
  leadID: number
}

export interface IWaiverActionPayload {
  customerID: number
  leadID: number
  waiverId?: number
  action: WaiverStatus
  collectionID?: number
}

export interface IWaiverHandle {
  waivedOffAmount: number
  waiverId: number
}

export interface IWaiverManagerPayload {
  search?: string
  type?: Products
  startDate?: string
  endDate?: string
  waiverType?: WaiverType
  status?: 'Approval Waiting' | 'Approved' | 'Rejected' | 'Pending'
}
