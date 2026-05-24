import { PennyDropType } from '../enums/pennyDrop.enum'

export interface IPennyDropModel {
  id?: number
  customerID: number
  p_id: string
  leadID: string
  name: string
  ifsc: string
  bank_name: string
  account_number: string
  account_status?: string
  registered_name?: string
  credated_date?: Date
  logs: string
  penny_status: string
  uid: string
  penny_drop_name_match?: PennyDropNameMatchStatus
  penny_type?: PennyDropType
}

export type TSelectPennyDropModel = keyof IPennyDropModel

export enum PennyDropNameMatchStatus {
  ACCEPTED = '0',
  ALLOW_NAME_MISMATCH = '1',
  REJECT = '2',
  NAME_MISMATCH = '3',
}
