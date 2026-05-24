import { NameSimilarityStatus } from '@/enums/finboxNameMatch.enum'

export interface IFinboxNameMatchModel {
  id?: number // BIGINT, should be of type number if using knex
  customerID?: number
  leadID?: number
  accountNo?: string
  firstName: string
  secondName: string
  pecentageMatch?: number
  status?: number // TINYINT should be number when using knex
  action_by?: number
  createdDate?: Date
}

export type TSelectFinboxNameMatch = keyof IFinboxNameMatchModel

export interface ICheckNamePercentage {
  leadId: number
  customerID: number
  customerMobileNo: string
  type: string
  firstName: string
  secondName: string
}

export interface ICheckNamePercentageResponse {
  errorCode: number
  errorMsg: string
  firstName: string
  secondName: string
  percentageConditionCheck: number
  percentageResult: number
  status: NameSimilarityStatus
}
