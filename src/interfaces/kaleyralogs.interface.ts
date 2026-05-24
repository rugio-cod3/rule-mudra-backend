import { Document } from 'mongoose'

interface IKalyeraLog extends Document {
  mobile: string
  req_url: string
  api_request: any // Use a more specific type if you know the structure
  api_response: any // Use a more specific type if you know the structure
  curl_error: string
  type: string
  created_at: Date
}

export default IKalyeraLog
