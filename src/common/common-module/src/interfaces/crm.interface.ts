export interface ILeadUpdatePayload {
  leadID: number
}

export interface IEmiCalculatorPayload {
  loanAmount: number
  roi: number
  tenure: number
}

export interface ICreditDetailsPayload {
  customer_id: number
  lead_id: number
  foir: number
  aqb: number
  branch: string
  loanAmtApproved: number
  roi: number
  tenure: number
  adminFee: number
  firstDueDate: Date
}

export interface IGetAmountToBeDisbursedPayload {
  creditID: number
}

export interface IGenerateEmiPayload {
  creditID: number
  loanNo: string
  mode: string
  referanceId: string
  order_id: string
  gateway: string
  createdBy: number
  updatedBy: number
}

export interface IUpdatePaymentPayload {
  creditID: number
  amount: number
  gateway: string
  method: string
}

export interface IApplyPenaltyPayload {
  emiID: number
  amount: number
}

export interface IGetEmisPayload {
  customerID: number
}

export interface IGetDocsRequirementsPayload {
  loanAmount: number
  roi: number
  tenure: number
  creditId: number
}

export interface IGetEmiLoanDetailsPayload {
  leadID: number
  customerID: number
}

export interface ILoanQueryResult {
  leadID: number;
  em_id: string;
  loanNo: string;
  accountNo: string;
  customerID: number;
  productID: number;
  ipc :number;
  status:string
}
export interface IExselMandate {
  id?: number;                       
  loanNo: string;                   
  leadID: number;                   
  customerID: number;             
  accountNo: string;              
  emandateID: string;               
  collectable_amount: number;        
  status: string;                                    
  userID: number;                  
  track: string;                                      
  productID: number;
}
export interface IErrorLog {
  LoanNumber: string;       
  Amount: number;       
  message: string; 
  uploadDate:Date   
}
export interface ILoanInfo {
  LoanNumber: string;
  Amount: number;
  Status: string;
  message: string;
  date_of_emandate: string;
}
export interface IStatusInfo {
  status: string;
  leadId: number;
  customerID: number;
  message: string;
}
export interface IRazorpayRequestData1 {
  customerID?: number
  customer_id?: string
  leadID?: number
  [key: string]: any
}
export interface IRazorpayRequestData {
  amount: number;
  currency: string;
  payment_capture?: boolean;
  leadID: number;
  customerID: number;
  customer_id?: string;
  receipt?: string;
  notes?: {
    notes_key_1?: string;
    notes_key_2?: string;
  };
  email?: string;
  contact?: string;
  order_id?: string;
  token?: string;
  recurring?: string;
  description?: string;
}
export interface ICSVGeneration {
  data: any[]
  headers: string[]
  filename: string
  folder: string
}
export interface IJsonResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;

  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, any>;
  };
}
export interface IPostRazorpayRequest {
  amount?: number;
  amount_due?: number;
  amount_paid?: number;
  attempts?: number;
  created_at?: number;
  currency?: string;
  entity?: string;
  id?: string;
  notes?: {
    notes_key_1: string;
    notes_key_2: string;
  };
  offer_id?: string | null;
  receipt?: string;
  status?: string;
  message?: string;
  success?:boolean
}
export interface IUploadedFile {
  originalname: string
  mimetype: string
  size: number
  buffer: Buffer
  path : string
}

export interface IFileUploadPayload {
  image: IUploadedFile
  userId:number
  name:string
}
export interface IMandatePayload {
  page:number
  limit : number
}
export interface IFileUrlPayload {
  fileName:string
}

export interface IProjectionReportPayload {
  startDate: Date
  endDate: Date
}
export interface IWebEngageUser {
  userId: number;
  firstName: string;
  lastName: string;
  birthDate: Date;  
  gender: string;
  email: string;
  phone: number;
  company: string;
  age: number;
}
export interface IPancard {
  pancard:string
}
