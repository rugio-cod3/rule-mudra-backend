export interface IRazorPayMandateStatusModel{
    id?:number;
    emId:string;
    leadID:string;
    customer_id:string;
    inv_id:string;
    emstatus:string;
    credated_date?:Date
    tokenID:string
    accountNo?:string
    accountType?:string
    bank?:string
    ifsc?:string;
}

export type TRazorPayMandateStatus = keyof IRazorPayMandateStatusModel