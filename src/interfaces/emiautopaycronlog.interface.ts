import { Document } from 'mongoose'

export interface IIndividualRecord {
  emiID: number
  razorpay_mendate_id: number
  status: 'failed' | 'success'
  errorMessage?: string
  step?: string
}

export interface IEmiAutoPaymentCronLog extends Document {
  emiIDs: number[]
  individualRecord: IIndividualRecord[]
  createdAt?: Date
  updatedAt?: Date
}
