import { Document, Types } from 'mongoose'

export interface IRazorpayWebhookLogs extends Document {
  id: Types.ObjectId
  subscriptionId: string
  response: string
  createdAt?: Date
  updatedAt?: Date
}
