export interface ICollectionFollowUp {
    reviewID?: number;
    customerID: number;
    leadID: number;
    loanNo: string;
    followType: string;
    StatusType: string;
    statusTypeDate?: string;
    remark: string;
    createdBy: number;
    createdDate: Date;
    followup_type: number;
    reason?: string;
    iu_date?: Date;
  }
  export type TSelectCollectionFollowUp = keyof ICollectionFollowUp