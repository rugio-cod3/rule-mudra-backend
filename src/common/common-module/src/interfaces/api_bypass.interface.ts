export enum ApiBypassTypes {
  BAANKING_V1 = 'banking_v1',
  BUREAU = 'bureau',
  CIBIL = 'cibil',
  DTREE = 'dtree',
  EMI_VALUE = 'emi_value',
  EXPERIAN = 'Experian',
}

export interface IApiBypassModel {
  id: number
  api_name: string
  type: string
  api_response: string
  response_type: string
  status: number
  iu_date: Date
  lenderID: number
}

export type TSelectApiByPassModel = keyof IApiBypassModel
