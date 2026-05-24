import { model, Schema, Document } from 'mongoose'
import { IEmiAutoPaymentCronLog } from '@/interfaces/emiautopaycronlog.interface'
export const DOCUMENT_NAME = 'EmiAutoPaymentCronLog'
export const COLLECTION_NAME = 'emiautopaymentcronlogs'

const schema = new Schema(
  {
    emiIDs: [
      {
        type: Number,
      },
    ],
    individualRecord: [
      {
        emiID: {
          type: Number,
        },
        razorpay_mendate_id: {
          type: Number,
        },
        status: {
          type: String,
          enum: ['failed', 'success'],
          default: 'failed',
        },
        errorMessage: {
          type: String,
        },
        step: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
)

export const EmiAutoPaymentCronLog = model<IEmiAutoPaymentCronLog>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
)
