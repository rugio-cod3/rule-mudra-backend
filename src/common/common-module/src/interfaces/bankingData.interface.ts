export interface IBankingDataModel {
  id?: number
  customerID: number
  leadID: number
  reference_id?: string
  entity_id?: string
  Decision?: string
  LoanAmount?: string
  version?: string
  createdDate?: Date
}

export type TSelectBankingData = keyof IBankingDataModel
