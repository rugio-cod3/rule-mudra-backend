export interface ICrProfileRepaymentData {
    id?: number; // Primary key
    report_id: number;
    profile_id: number;
    customerID: number;
    profile_account_id: number;
    repayment_status: string; 
    repayment_date: Date;
    account_type: number;
    created_by: number;
    created_at: Date;
    is_report_deleted: string; 
    updated_at: Date | null;
  }
  export type TSelectCrProfileRepaymentData = keyof ICrProfileRepaymentData

  