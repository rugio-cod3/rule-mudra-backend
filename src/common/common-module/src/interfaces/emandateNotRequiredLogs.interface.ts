export interface IEmandateNotRequiredLogsModel {
  id?: number
  customerID: number
  nr_startBy: number
  nr_startDate?: Date
  nr_endBy?: number
  nr_endDate?: Date
  last_emandate_paid?: number
}

export type TSelectEmandateNotRequiredLogs = keyof IEmandateNotRequiredLogsModel
