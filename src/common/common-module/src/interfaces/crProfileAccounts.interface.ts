export interface ICrProfileAccounts {
    id?: number; // Primary key
    report_id: number;
    profile_id: number;
    customerID: number;
    product_id: number;
    opening_date: Date;
    reporting_date: Date;
    closing_date: Date | null; // Nullable column
    last_payment: Date | null; // Nullable column
    bank_name: string;
    bank_id: number;
    account_no: string;
    loan_amount: number;
    credit_limit: number;
    current_balance: number;
    overdue_bal: number;
    account_type: number;
    tenure: number;
    roi: string; 
    duration: number;
    frequency: string; 
    account_status: number;
    holder_type: number;
    on_time_payments: number;
    due_date_payments: number | null; // Nullable column
    addresses_json: string; // Assuming JSON stored as a text
    holder_ids_json: Record<string, any>;
    latest_account: number;
    oldest_account: number;
    created_by: number;
    created_at: Date;
    is_report_deleted: string;
    updated_at: Date | null;
  }
  export type TSelectCrProfileAccounts = keyof ICrProfileAccounts
