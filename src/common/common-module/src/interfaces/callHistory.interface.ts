export interface ICallHistoryModel {
    callHistoryID?: number
    customerID: number
    leadID: number
    callType: string
    status: string
    noteli: string
    remark: string
    callbackTime?: Date
    calledBy: number
    createdDate?: Date
    // appAmount?:string;
  }
  
  export type TSelectCallHistory = keyof ICallHistoryModel