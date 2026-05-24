export interface IThirdPartyLogsModel {
  id?: number
  customerID: number
  leadID: number
  api_supplier?: number
  api_type?: string
  api_endpoint_url: string
  api_method: string
  api_request: string
  api_response: string
  status: number
  created_at?: Date
}

export type TSelectThirdPartyLogs = keyof IThirdPartyLogsModel