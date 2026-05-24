import { NameMatchType } from '../enums/finbox.enum'
import { CommonNameMatchType, NameSimilarityStatus } from '../enums/nameMatch.enum'

export interface INameMatchPayload<T extends INameMatchBaseData> {
  type: CommonNameMatchType
  data: T
}

export interface INameMatchBaseData {
  pancard?: string
  aadharNo?: string
  mobile?: string
  leadID?: number
  customerID?: number
  name?: string
  nameMatchType?: NameMatchType
  bankConnectName?: string
}

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
