export interface IApiReqResLog {
  id?: number
  customerID?: string
  mobile?: string
  api_request?: string
  api_response?: string
  created_at?: Date
  status?: string
  message?: string
  api_name?: string
}
