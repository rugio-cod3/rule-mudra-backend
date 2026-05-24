export interface IAppVideoModel {
    vid?: number
    customerID: number
    leadID: number
    vSize: string
    viFile: string
    vUrl: string
    credated_date: Date
    upload_platform: 'local' | 'S3'
    rejected_status?: '0' | '1'
  }
  
  export type TSelectAppVideo = keyof IAppVideoModel
  