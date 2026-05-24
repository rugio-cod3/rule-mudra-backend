export interface IApiBypassModel {
  id: number
  api_name: string
  type: string
  api_response: string
  response_type: string
  status: number
  iu_date: Date
}

export type TSelectApiByPassModel = keyof IApiBypassModel
