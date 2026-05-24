
export interface ICallDisposition {
  id?: number | null;
  call_date?: Date | null;
  call_time?: string | null;
  loan_no?: string | null;
  agent_name?: string | null;
  campaign?: string | null;
  disposition?: string | null;
  sub_disposition?: string | null;
  callback_time?: Date | null;
  next_action_datetime?: Date | null;
  ptp_amount?: number | null;
  remarks?: string | null;
  lot_name?: string | null;
  branch_name?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_mobile?: number | null;
  loan_amount?: number | null;
  due_date_repay_amount?: number | null;
  repay_amount?: number | null;
  disbursed_date?: Date | null;
  repay_date?: Date | null;
  remaining_collection?: number | null;
  total_collection?: number | null;
  loan_tenure?: number | null;
  roi?: number | null;
  address?: string | null;
  call_landing_time?: string | null;
  call_duration?: number | null;
  disposition_duration?: number | null;
  end_call_time?: string | null;
  hangup_by?: string | null;
}
export interface ICallDisposition {
  startDate :Date
  endDate:Date
}
export interface ICallDescription {
  callDate :Date
  repayDate:Date
}

export type TSelectCallDisposition = keyof ICallDisposition;

