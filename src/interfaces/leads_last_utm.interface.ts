export interface ILeadsLastUtmModel {
  id?: number
  leadID: number
  utmSource: string
  utm_assigned_date: Date
  created_at?: Date
  updated_at?: Date
}

export type TSelectLeadsLastUtm = keyof ILeadsLastUtmModel
