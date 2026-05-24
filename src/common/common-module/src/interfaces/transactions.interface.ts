import { CollectedMode } from '../enums/collection.enum'

export interface ITransaction {
  discount_type?: string
  id?: number
  customerID: number
  leadID: number
  loanNo?: string
  status: number | string
  type:
    | 'disbursal'
    | 'collection'
    | 'pf'
    | 'gst'
    | 'subscriptionCharged'
    | 'subscriptionActivation'
    | 'subscriptionChargedManual'
    | 'subscriptionAuthentication'
    | 'subscriptionInvoicePaid'
    | 'refund'
    | 'processing_fee'
    | 'bpi'
    | 'penalty'
    | 'disbursed'
  mode?: CollectedMode
  referenceNo?: string
  orderId?: string
  deleted: number
  gateway?: string
  createdAt?: Date
  updatedAt?: Date
  createdBy?: number
  updatedBy: number
  amount: number
  collectionID?: number
  emiID?: number
  transactionDate?: Date
  remarks?: string
  payment_transaction_status?: string
  waiver?: number
}

export type TSelectTransaction = keyof ITransaction
export interface IWhereClause {
  customerID: number
  status: number
  type?: { $in: string[] }
}
