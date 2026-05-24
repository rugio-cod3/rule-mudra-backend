import { BankAccountStatus, BankAccountType } from '@/enums/customerBankAccount.enum'

export interface ICustomerAccount {
  accountID?: number
  leadID: number
  customerID: number
  accountNo: string
  accountType: BankAccountType
  bankIfsc: string
  bank: string
  bankBranch: string
  ip: string
  credatedBy: number
  status: BankAccountStatus
  createdDate?: Date
  bank_holder_name?: string
  is_credit?: '0' | '1'
}

export type TSelectCustomerAccount = keyof ICustomerAccount
