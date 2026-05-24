export interface ICallHistoryLog {
  callHistoryID?: number
  customerID: number
  leadID: number
  callType: string
  status: string
  appAmount?: string
  noteli: string
  remark: string
  callbackTime?: Date
  calledBy: number | string
  createdDate?: Date
}

export type TSelectCallHistoryLog = keyof ICallHistoryLog
