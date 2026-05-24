export interface ICreditReport {
  id: number
  cr_provider: number
  bucket_id: number
  customerID: number
  stage_one_id: string
  stage_two_id: string
  errors: string | null
  status: number
  score: number
  response_time: number
  initiated_by: number
  action_type: number
  cb_mark: number
  created_by: number
  log_id: number
  created_at: Date
  updated_at: Date
  updated_by: number
  unique_cust_id: string
}
export type TSelectCreditReport = keyof ICreditReport
