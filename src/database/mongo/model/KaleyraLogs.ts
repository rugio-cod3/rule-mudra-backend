import ISmsLog from '@/interfaces/kaleyralogs.interface'
import { model, Schema, Document } from 'mongoose'

export const DOCUMENT_NAME = 'KaleyraLog'
export const COLLECTION_NAME = 'kaleyralogs'

const schema = new Schema(
  {
    mobile: {
      type: Number,
      required: true,
    },
    req_url: {
      type: String,
      required: true,
    },
    api_request: {
      type: String,
      required: true,
    },
    api_response: {
      type: String,
    },
    curl_error: {
      type: String,
    },
    type: {
      type: String,
      default: 'SMS',
      required: true,
    },
  },
  { timestamps: true },
)

export const KaleyraLogs = model<ISmsLog>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
)
