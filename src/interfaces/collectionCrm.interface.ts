export interface ITransactionModel {
    id?: number; // Auto-increment, can be optional for inserts
    customerID: number;
    leadID: number;
    loanNo?: string;
    status: number;
    type?: string;
    mode?: string;
    referenceNo?: string;
    orderId?: string;
    deleted: number;
    gateway?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy: number;
    updatedBy: number;
    amount: number;
    collectionID?: number | null;
    emiID?: number | null;
    transactionDate?: Date | null;
    remarks?: string | null;
    iu_date?: string;
    payment_transaction_status?: string | null;
    waiver?: number | null;
  }
  

export type TSelectTransaction = keyof ITransactionModel

export interface IAddCollectionCrmPayload {
  customerID: number
  leadID: number
  userID: number
  status: string
  method: string
  orderId: string
  amount: number
  gateway: number
  transactionDate: Date
  remarks: string
  waiver: number,
  payment_transaction_status: string,
  discount_type: string
}

export interface IAllCollectionPayload {
  customerID: number
  leadID: number
}
