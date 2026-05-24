import { ReferenceRelation } from "@/enums/common.enum";
import { ICustomer } from "./customer.interface";
import { IRazorPayVerifyFundAccountByIdResponse } from "./razorpay_payout_accounts.interface";
import { IUserStep } from "./step-tracker";

export interface IFinboxCreateUrlPayload {
  mobileNo: string;
  callBackUrl?: string;
  leadID?: number;
  loan_id?: number;
  customerID: number;
  session_expire?: boolean;
}

export interface IFinboxBankConnectPayload {
  mobileNo: string;
  entityId: string;
  loan_id?: number;
  leadID?: number;
  customerID: number;
  aadharNo: string;
  pancard: string;
  step?: string;
  email: string;
}

export interface IPanFetchPayload {
  pan: string;
  customerID: number;
  mobileNo: number;
  customerPanCardNo: string;
  pan_cust_verified?: number;
  email?: string;
}

export interface IPanConfirmationPayload extends IUserStep {
  panNumber: string;
  customerID: number;
  mobileNo: number;
  email: string;
}

export interface ISurePassValidatePan {
  panNumber: string;
  customerId: number;
  mobileNo: number;
}
export interface ISurePassAadharInititateResponse {
  // data: {
  //   prefill_options: {
  //     full_name: string;
  //     mobile_number: string;
  //     user_email: string;
  //   };
  //   expiry_minutes: number;
  //   send_sms: boolean;
  //   send_email: boolean;
  //   verify_phone: boolean;
  //   verify_email: boolean;
  //   signup_flow: boolean;
  //   redirect_url: string;
  //   state: string;
  // };
  data: {
    client_id: string;
    token: string;
    url: string;
    expiry_seconds: number;
  };
  status_code: number;
  message_code: string;
  messge: string;
  success: boolean;
}
export interface ISurePassValidatePanResponse {
  data: {
    pan_number: string;
    full_name: string;
    full_name_split: [string, string, string];
    gender: string;
    dob: string;
    aadhaar_linked: boolean;
    masked_aadhaar: string;
    address?: {
      full?: string;
    };
  };
  status_code: number;
  success: boolean;
  message: string | null;
  message_code: string;
}

export interface ISurePassSendAadharOtpPayload {
  aadharNo: string;
  customerID: number;
  mobileNo: number;
  customerAadharNo: string;
  dob_digit_match?: string;
}

export interface ISurePassSendAadharOtp {
  aadharNo: string;
  customerID: number;
  mobileNo: number;
}

export interface ISurePassSendAadharOtpResponse {
  data: {
    client_id: string;
    otp_sent: boolean;
    if_number: boolean;
    valid_aadhaar: boolean;
    status: string;
  };
  status_code: number;
  message_code: string;
  message: string;
  success: boolean;
}

export interface IVerifyAadharOtpSurePassPayload extends IUserStep {
  otp: string;
  customerID: number;
  mobileNo: number;
  customerAadharNo: string;
  aadharNo: string;
  dob_digit_match?: string;
  userIp?: string;
}

export interface ISurePassVerifyAadhar {
  client_id: string;
  otp: string;
  customerID: number;
  mobileNo: number;
  aadharNo: string;
}

export interface ISurePassVerifyAadharResponse {
  data: {
    client_id: string;
    full_name: string;
    aadhaar_number: string;
    dob: string;
    gender: string;
    address: {
      country: string;
      dist: string;
      state: string;
      po: string;
      loc: string;
      vtc: string;
      subdist: string;
      street: string;
      house: string;
      landmark: string;
    };
    face_status: boolean;
    face_score: number;
    zip: string;
    profile_image: string;
    has_image: boolean;
    email_hash: string;
    mobile_hash: string;
    raw_xml: string;
    zip_data: string;
    care_of: null | string;
    share_code: string;
    mobile_verified: boolean;
    reference_id: string;
    aadhaar_pdf: string;
    status: string;
    uniqueness_id: string;
  };
  status_code: number;
  success: boolean;
  message: null | string;
  message_code: string;
}
export interface IAadharVerificationInitiateSurepassDigiLockerPayload {
  customerID: number;
  mobile: number;
  name: string;
  email: string;
  callBackUrl: string;
  dob_digit_match: string;
  customerAadharNo?: number;
}
export interface IAadharVerificationInitiateDigiLockerPayload {
  customerID: number;
  mobile: number;
  customerAadharNo: string;
  callBackUrl: string;
  dob_digit_match: string;
}

export interface IDecentroAadharInititateResponse {
  decentroTxnId: string;
  status: string;
  responseCode: string;
  message: string;
  data: {
    authorizationUrl: string;
  };
  responseKey: string;
}

export interface IAadharVerificationWebhookDigiLocker {
  state: string;
  code: string;
  customerID: number;
  mobile: string;
}

export interface IAadharVerificationWebhookDigiLockerSurepass {
  state: string;
  client_id: string;
  customerID: number;
  mobile: string;
}

export interface IDecentroEaadharResponse {
  decentroTxnId: string;
  status: string;
  responseCode: string;
  message: string;
  data: {
    aadhaarReferenceNumber: string;
    aadhaarUid: string;
    proofOfIdentity: {
      dob: string;
      hashedEmail: string;
      gender: string;
      hashedMobileNumber: string;
      name: string;
    };
    proofOfAddress: {
      careOf: string;
      country: string;
      district: string;
      house: string;
      landmark: string;
      locality: string;
      pincode: string;
      postOffice: string;
      state: string;
      street: string;
      subDistrict: string;
      vtc: string;
    };
    image: string;
    pdf: string;
  };
  responseKey: string;
}

export interface INameEmailOnboardingPayload {
  email: string;
  pan: string;
}

export interface INewCustomerOnboardingInput {
  customerId: number;
  residenceAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  finboxCallBackUrl?: string;
}

export interface INewCustomerOnboardingResponse {
  statusCode: number;
  MessageCode: string;
  DataCode?: {
    customerID?: number;
    leadID?: string;
    Finbox_URL?: string;
    pageName?: string;
  };
}

export interface IPennyDropInitiatePayload {
  loan_id: number;
  customer: ICustomer;
  account_id: number;
}

export interface IPennyDropVerifyPayload {
  pennyDropId: number;
  customer: ICustomer;
}

export interface IPennyDropNameMatchPayload {
  pancard: string;
  aadharNo: string;
  verifyTransactionPayload: IRazorPayVerifyFundAccountByIdResponse;
  mobile: string;
  customerID: number;
  leadID: number;
}

export interface IEmandatePayload {
  loan_id: number;
  account_id: number;
  customerId: number;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  emandateRequired: "1" | "0";
}

export interface ICreateEmandateLink {
  name: string;
  email: string;
  contact: string;
  amount: number;
  accountNo: string;
  accountType: string;
  ifsc: string;
}

export interface IRazorpaySubscriptionRegistrationRequest {
  customer: {
    name: string;
    email: string;
    contact: string;
  };
  type: string;
  amount: number;
  currency: string;
  description: string;
  subscription_registration: {
    method: string;
    auth_type: string;
    expire_at: number;
    max_amount: number;
    bank_account: {
      beneficiary_name: string;
      account_number: string;
      account_type: string;
      ifsc_code: string;
    };
  };
  receipt: string;
  expire_by: number;
  sms_notify: number;
  email_notify: number;
  notes: Record<any, any>;
}

export interface IRazorpaySubscriptionRegistrationResponse {
  id: string;
  entity: string;
  receipt: string;
  invoice_number: string;
  customer_id: string;
  customer_details: {
    id: string;
    name: string;
    email: string;
    contact: string;
    gstin: string | null;
    billing_address: string | null;
    shipping_address: string | null;
    customer_name: string;
    customer_email: string;
    customer_contact: string;
  };
  order_id: string;
  line_items: any[]; // Adjust the type of line_items if needed
  payment_id: string | null;
  status: string;
  expire_by: number;
  issued_at: number;
  paid_at: number | null;
  cancelled_at: number | null;
  expired_at: number | null;
  sms_status: string;
  email_status: string;
  date: number;
  terms: string | null;
  partial_payment: boolean;
  gross_amount: number;
  tax_amount: number;
  taxable_amount: number;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  currency_symbol: string;
  description: string;
  notes: Record<any, any>;
  comment: string | null;
  short_url: string;
  view_less: boolean;
  billing_start: number | null;
  billing_end: number | null;
  type: string;
  group_taxes_discounts: boolean;
  created_at: number;
  idempotency_key: string | null;
}

export interface IRazorPayEmandateWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        invoice_id: string;
        international: boolean;
        method: string;
        amount_refunded: number;
        refund_status: string | null;
        captured: boolean;
        description: string;
        card_id: string | null;
        bank: string;
        wallet: string | null;
        vpa: string | null;
        email: string;
        contact: string;
        customer_id: string;
        token_id: string;
        notes: Record<string, string>;
        fee: number;
        tax: number;
        error_code: string | null;
        error_description: string | null;
        error_source: string | null;
        error_step: string | null;
        error_reason: string | null;
        acquirer_data: Record<string, any>;
        created_at: number;
      };
    };
    order: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt: string;
        offer_id: string | null;
        offers: {
          entity: string;
          count: number;
          items: any[];
        };
        status: string;
        attempts: number;
        notes: string[];
        created_at: number;
        token: {
          method: string;
          notes: Record<string, string>;
          recurring_status: string | null;
          failure_reason: string | null;
          currency: string;
          max_amount: number;
          auth_type: string | null;
          expire_at: number;
          bank_account: {
            ifsc: string;
            bank_name: string;
            name: string;
            account_number: string;
            account_type: string;
            beneficiary_email: string;
            beneficiary_mobile: string;
          };
          first_payment_amount: number;
        };
      };
    };
    invoice: {
      entity: {
        id: string;
        entity: string;
        receipt: string;
        invoice_number: string;
        customer_id: string;
        customer_details: {
          id: string;
          name: string;
          email: string;
          contact: string;
          gstin: string | null;
          billing_address: string | null;
          shipping_address: string | null;
          customer_name: string;
          customer_email: string;
          customer_contact: string;
        };
        order_id: string;
        payment_id: string;
        status: string;
        expire_by: number;
        issued_at: number;
        paid_at: number;
        cancelled_at: number | null;
        expired_at: number | null;
        sms_status: string;
        email_status: string;
        date: number;
        terms: string | null;
        partial_payment: boolean;
        gross_amount: number;
        tax_amount: number;
        taxable_amount: number;
        amount: number;
        amount_paid: number;
        amount_due: number;
        first_payment_min_amount: number | null;
        currency: string;
        currency_symbol: string;
        description: string;
        notes: Record<string, string>;
        comment: string | null;
        short_url: string;
        view_less: boolean;
        billing_start: number | null;
        billing_end: number | null;
        type: string;
        group_taxes_discounts: boolean;
        supply_state_code: string | null;
        user_id: string;
        created_at: number;
        idempotency_key: string | null;
      };
    };
  };
  created_at: number;
}

export interface IReferenceDetailsPayload {
  name_1: string;
  relation_1: ReferenceRelation;
  mobile_no_1: number;
  name_2: string;
  relation_2: ReferenceRelation;
  mobile_no_2: number;
  leadID?: number;
  loan_id?: number;
}

export interface IUpdateReferenceDetailsPayload {
  name_1: string;
  relation_1: ReferenceRelation;
  mobile_no_1: number;
  name_2: string;
  relation_2: ReferenceRelation;
  mobile_no_2: number;
  leadID?: number;
  loan_id?: number;
  id_1: number;
  id_2: number;
}

export interface ICustomerIncompleteDetailsPayload {
  step?: number;
  leadID?: number;
  loan_id?: number;
  salary_date?: string;
  loan_required?: number;
  loan_purpose?: string;
  gender?: string;
  company_name?: string;
  office_email_id?: string;
  designation?: string;
  monthly_income?: number;
  working_since?: Date;
  industry?: string;
  residence_type?: string;
  residence_address?: string;
  state?: string;
  city?: string;
  pincode?: number;
  landmark?: string;
  marrital?: string;
  education?: string;
  employee_type?: string;
  salary_mode?: string;
  total_experience?: number;
  finboxCallBackUrl: string;
  repeat?: boolean;
}
export interface ISearchWordPayload {
  searchWord: string;
}

export interface IApprovalView {
  totalAmount: number;
  roi: number;
  processingFee: number;
  gst: number;
  processingAmount: number;
  gstOfAdminFee: number;
  finalAmount: number;
  repayDate: Date;
  tenure: number;
  expiryDate: Date;
  repayAmount: number;
  isLoanAmountUpgradable: boolean;
  isSalaried: boolean;
}
export interface IKeyFactPayload {
  leadId?: number;
  loan_id?: number;
  customerId?: number;
  pancard?: string;
  mobile?: number;
  uploadDocs?: boolean;
}
export interface ICustomerCheckDetails {
  loan_required: number;
  loan_id?: number;
  loan_purpose: string;
  marrital?: string;
  education?: string;
  employeeType:
    | "Salaried"
    | "Self Employee"
    | "Professional"
    | "Not Employed"
    | "NA";
  modeOfPayment: string;
  company_name: string;
  industry?: string;
  designation?: string;
  monthly_income: number;
  salary_date: string;
  residenceType?: string;
  state?: string;
  city?: string;
  pincode?: number;
  residenceAddress?: string;
  landmark?: string;
  callBackUrl?: string;
  utm_source?: string;
  plateform?: string;
}

export interface INewApiCibilAndBre {
  status: string;
  message: string;
  access_token: string;
  data: {
    status: number;
    message: string;
  };
}

export interface INewApiCheckCustomer {
  checkLeadType: string;
  checkCurrentStatus: string;
  checkDPD: number;
  checkLastCloseLoan: number;
  checkDisbursedLoan: number;
  checkPartPaymentLoan: number;
  isRamfinCustomer: "Yes" | "No";
  isRejected: string;
  isRejectedApply: 0 | 1;
  is_DPDApply: 0 | 1;
  loanAmount: number;
}

export interface INewApiCheckCustomerBody {
  pancard: string;
}

interface Address {
  building_name: string;
  locality: string;
  street_name: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

interface Result {
  pan: string;
  pan_type: string;
  fullname: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  aadhaar_number: string;
  aadhaar_linked: boolean;
  dob: string;
  address: Address;
  mobile: string;
  email: string;
  signatory_details: Record<string, any>;
  is_sole_proprietor: string;
  is_director: string;
  is_salaried: string;
  pan_status: string;
  pan_allotment_date: string;
}

export interface IApiResponseDigitapPan {
  http_response_code: number;
  result_code: number;
  request_id: string;
  client_ref_num: string;
  result: Result;
}
export interface IPanFetchPayloadDigitap {
  panNumber: string;
  customerID?: number;
  mobileNo?: number;
  customerPanCardNo?: string;
}

export interface IEmiBreakdown {
  month: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  remainingPrincipal: number;
  dueDate: string;
}

export interface ILoanData {
  totalEMI: number;
  tenure: number;
  roi: number;
  amount: number;
  interest: number;
  paidAmount: number;
  repaymentAmount: number;
  totalEMIs: number;
  EMILeft: number;
  emiBreakdown: IEmiBreakdown[];
  processingFee: number;
  firstDueDate: string;
  brokenPeriodInterest: number;
  netDisbursedAmount: number;
  gst: number;
}

export interface ILoanApprovalPayload {
  loanID: number;
  customerID: number;
}

export interface IBankVerifyPayload {
  loan_id: string;
  accountNo: string;
  ifsc: string;
}

export interface ISurepassDigilockerStatusResponse {
  data: {
    error_description: string;
    status: string;
    completed: boolean;
    failed: boolean;
    aadhaar_linked: boolean;
  };
  status_code: number;
  success: boolean;
  message: string;
  message_code: string;
}

export interface ISurepassDigilockerDocumentListResponse {
  data: {
    documents: Array<{
      file_id: string;
      name: string;
      doc_type: string;
      downloaded: boolean;
      issuer: string;
      description: string;
    }>;
  };
  status_code: number;
  success: boolean;
  message: string;
  message_code: string;
}

export interface ISurepassDigilockerDocumentDownloadResponse {
  data: {
    download_url: string;
    mime_type: string;
  };
  status_code: number;
  success: boolean;
  message: string;
  message_code: string;
}

export interface ISurepassFaceMatchResponse {
  data: {
    match_status: boolean;
    confidence: number;
  };
  message_code?: string | null;
  message?: string | null;
  status_code: number;
  success: boolean;
}

export interface IDigitalSignPayload {
  callback_url: string;
}

export interface IDigitalSignReportPayload {
  client_id: string;
}

export interface IAadharVerificationWebhookDigiLockerDigitap {
  transactionId: string;
  state?: string;
  customerID: number;
  mobile: string;
}

export type TSelectICustomerCheckDetails = keyof ICustomerCheckDetails;
