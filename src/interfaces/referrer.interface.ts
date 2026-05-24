export interface IReferrerModel {
  id?: number
  referrer: string
  mobile: number
  created_at?: Date
  updated_at?: Date
}

export type TSelectReferrer = keyof IReferrerModel
