import { model, Schema, Document } from 'mongoose'
import { IRazorpayWebhookLogs } from '@/interfaces/razorpaywebhooklogs.interface'
export const DOCUMENT_NAME = 'RazorpayWebhookLogs'
export const COLLECTION_NAME = 'razorpaywebhooklogs'

const schema = new Schema(
  {
    subscriptionId: {
      type: String,
    },
    response: {
      type: String,
    },
  },
  { timestamps: true },
)

export const RazorpayWebhookLogsModel = model<IRazorpayWebhookLogs>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
)
