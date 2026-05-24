export interface IAutoDisbursalLogsModel {
    id?: number
    customerID?: number
    leadID?: number
    api_request?: string
    api_response?: string
    userID?: number
    any_error?: string
    status:string
    createdDate?: Date
  }
  
  export type TSelectDisbursalLogs = keyof IAutoDisbursalLogsModel
  