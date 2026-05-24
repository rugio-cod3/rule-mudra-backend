export interface IDisbursalJobsModel {
    id?: number
    customerID: number
    leadID: number
    loanID: number
    loanNo: string
    accountNo: number
    ifsc: string
    actualDisbAmount: string
    custName: string
    custMobile: string
    custEmail: string
    companyAcc: string
    userID?: number
    createdDate?: Date
    currentStatus?: number
    jobStatus?: number
    apiStatus?: number
  }
  
  export type TSelectDisbursalJobs = keyof IDisbursalJobsModel
  