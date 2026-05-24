import { IStepControlModel } from '../interfaces/stepControl.interface'

export interface IStepTrackerModel {
  id?: number
  step_id: number
  is_completed?: boolean
  created_at?: Date
  updated_at?: Date
  is_skippable?:boolean
  customer_id: number
  lead_id?:number
}

export interface IStepTrackerJoinStepControl extends IStepControlModel {
  id?: number
  step_id: number
  is_completed: boolean
  created_at?: Date
  updated_at?: Date
  customer_id: number
}

export type TSelectStepTracker = keyof IStepTrackerModel

export interface IUpdateStep {
  customerID: number
  stepId: number
  currentStepOrder: number
  productId: number
  isCompleted: boolean
}

export interface IUserStep {
  userStep: IStepTrackerJoinStepControl
}

export interface ICreateStepTrackerForProduct {
  isCurrentStep: boolean
  step: IStepControlModel
  isOldStep: boolean
  isNextStep: boolean
}
