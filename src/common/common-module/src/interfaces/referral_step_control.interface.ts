import { StepName } from '../enums/common.enum'

export interface IReferralStepControlModel {
  id?: number
  product_id: number
  step_name: StepName // ENUM
  step_display_name: string // ENUM
  step_order: number
  next_route: string
  is_active: boolean
  created_at?: Date
  created_by: number
  updated_by?: number
  updated_at?: Date
  current_route: string
  prev_route?: string
}

export type TSelectReferrarStepControl = keyof IReferralStepControlModel
