import { StepName } from '../enums/common.enum'

export interface IStepControlModel {
  id?: number
  product_id: number
  provider_id?: string
  instrument_id?: number
  step_name: StepName // ENUM
  step_display_name: string // ENUM
  pre_step_name: string // array
  pre_step_display_name: string // array
  post_step_name: string
  post_step_display_name: string
  step_order: number
  next_route: string
  is_active: boolean
  created_at?: Date
  created_by: number
  updated_by?: number
  updated_at?: Date
  current_route: string
  prev_route?: string
  dashboard_message1?: string
  dashboard_message2?: string
  dashboard_message3?: string
  dashboard_message4?: string
  should_recheck?: boolean
}

export type TSelectStepControl = keyof IStepControlModel
