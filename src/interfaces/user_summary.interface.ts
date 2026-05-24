
export interface IUserSummary {
  id?: number
  api_type: string
  customerID: number
  provider_id: number
  json_value: string
  Status: number
  created_at?: Date
  created_by: number
  updatedAt?: Date
}

export type TSelectUserSummary = keyof IUserSummary