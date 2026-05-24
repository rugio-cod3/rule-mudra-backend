export interface ILoan {
  loanID?: number // Auto-incrementing primary key
  leadID: number
  loanNo: string // varchar(255)
  customerID: number
  approvalID?: number
  // Double with precision (10,2)
  disbursalAmount: number

  disbursalDate?: Date // Text for date
  disbursalTime?: string // Time as a string
  disbursalRefrenceNo?: string // varchar(255)
  accountNo: string // varchar(100)
  accountType: string // varchar(100)
  bankIfsc: string // varchar(100)
  bank: string // varchar(255)
  bankBranch: string // varchar(255)
  chequeDetails: string // varchar(255)
  pdDate: string // date as a string
  pdDoneBy: string // varchar(100)
  repayDate?: Date
  // Double with precision (10,2)
  deduction: number

  remarks: string // varchar(255)

  // Enum values can be represented as union types of possible string values
  status:
    | 'Disbursed'
    | 'Disbursal Sheet Send'
    | 'Failed'
    | 'Refund'
    | 'Bank Update Rejected'
    | 'Disbursal Approved'
    | 'Bank Update Hold'

  rejReason?: string // varchar(256)
  companyAccountNo: string // varchar(255)
  ip: string // varchar(100)
  disbursedBy: number // Integer (ID of the user who disbursed)

  createdDate?: Date // datetime represented as Date object
  allocate_date?: Date // datetime represented as Date object
  allocated_by?: string // varchar(64)

  // Enum for `is_manual` represented as a union type of possible values
  is_manual?: '0' | '1'

  manual_date?: string // varchar(64)
  utr?: string // varchar(128)
  payout_status?: 1 | 2
}
export type TSelectLoan = keyof ILoan

export interface ICalculateRepayAmountIpc {
  totalPayableAmount: number
  repayDate: Date
  totalInterest: number
  dpdCharges: number
  principalAmount: number
  totalAmount: number
  totalAmountInterest: number
  totalAmountDpdCharge: number
  totalAmountPrincipal: number
}
