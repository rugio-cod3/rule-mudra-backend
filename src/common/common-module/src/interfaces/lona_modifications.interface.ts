export interface ILoanModification {
    id?: number;
    leadID: number;
    customer_name?: string;
    credit_manager_id: number;
    credit_manager_name?: string;
    old_roi?: number;
    new_roi?: number;
    old_tenure?: number;
    new_tenure?: number;
    old_amount?: number;
    new_amount?: number;
    old_pf?: number;
    new_pf?: number;
    old_repayDate?: string;
    new_repayDate?: string;
    lead_status?: string;
    created_at?: string; 
    product_type?: number | null; 
  }
  export type TSelectLoanModification = keyof ILoanModification