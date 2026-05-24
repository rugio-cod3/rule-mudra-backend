import {
  RazorPayContactType,
  RazorPayValidateStatus,
} from '@/enums/razorpay.enum'

export interface IRazorPayPayoutAccountsModel {
  payaccID?: number
  customerID: string
  leadID: string
  acc_id: string
  entity: string
  contact_id: string
  account_type: string
  ifsc: string
  bank_name: string
  name: string
  account_number: string
  active: boolean
  batch_id: string
  createdDate?: Date
  uid: string
}

export type TSelectRazorPayPayoutAccountsModel =
  keyof IRazorPayPayoutAccountsModel

export interface IRazorPayContactsRequest {
  name: string
  email: string
  contact: number
  type: RazorPayContactType
  reference_id: string
  notes: {
    notes_key_1: string
    notes_key_2: string
  }
}

export interface IRazorPayContactsResponse extends IRazorPayErrorResponse {
  id: string
  entity: string
  name: string
  contact: string
  email: string
  type: RazorPayContactType
  reference_id: string
  batch_id?: string
  active: boolean
  notes: Record<any, any>
  created_at: number // timestamp
}

export interface IRazorPayErrorResponse {
  error?: {
    code: string
    description: string
    source: string
    step?: string
    reason?: string
    metadata?: Record<any, any>
    field: string
  }
}

export interface IRazorPayCreateFundAccountRequest {
  contact_id: string
  account_type: string
  bank_account: {
    name: string
    ifsc: string
    account_number: string
  }
}

export interface IRazorPayCreateFundAccountResponse
  extends IRazorPayErrorResponse {
  id: string
  entity: string
  contact_id: string
  account_type: string
  bank_account: {
    ifsc: string
    bank_name: string
    name: string
    account_number: string
    notes: Array<any>
  }
  active: boolean
  batch_id?: string
  created_at: number
}

export interface IRazorPayValidateAccountRequest {
  account_number: string
  fund_account: {
    id: string
  }
  amount: number
  currency: string
  notes: Record<any, any>
}

export interface IRazorPayValidateAccountResponse
  extends IRazorPayErrorResponse {
  id: string
  entity: string
  fund_account: {
    id: string
    entity: string
    contact_id: string
    account_type: string
    bank_account: {
      name: string
      bank_name: string
      ifsc: string
      account_number: string
    }
    batch_id?: string
    active: boolean
    created_at: number
  }
  status: RazorPayValidateStatus
  amount: number
  currency: string
  notes: Record<any, any>
  results: {
    account_status?: string
    registered_name?: string
  }
  created_at: number
  utr?: string
}

export interface IRazorPayVerifyFundAccountByIdRequest {
  p_id: string
}

export interface IRazorPayVerifyFundAccountByIdResponse
  extends IRazorPayErrorResponse {
  id: string
  entity: string
  fund_account: {
    id: string
    entity: string
    contact_id: string
    account_type: string
    bank_account: {
      name: string
      bank_name: string
      ifsc: string
      account_number: string
    }
    batch_id?: string
    active: boolean
    created_at: number
  }
  status: RazorPayValidateStatus
  amount: number
  currency: string
  notes: Record<any, any>
  results: {
    account_status?: string
    registered_name?: string
  }
  created_at: number
  utr?: string
}