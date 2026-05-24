import { double } from "aws-sdk/clients/lightsail"

export interface IEmi {
  emiID?: number // Auto-increment primary key
  creditID: number
  productID: number
  leadID: number
  customerID: number
  principal: number // Using 'number' to represent double type
  interest: number // Typo correction: 'interest' instead of 'intrest'
  panelty?: number // Typo correction: 'penalty' instead of 'panelty'
  amountPayable: number
  openingBalance: number
  closingBalance: number // Typo correction: 'closingBalance' instead of 'closeingBalance'
  dueDate: Date // Date-time data type
  actualPaymentDate?: Date // Date-time data type
  delayDays?: number
  paneltyID?: number // Typo correction: 'penaltyID' instead of 'paneltyID'
  paymentID?: string
  status: string //["paid","due","partially-paid"]
  amountRemains: number
  createdAt?: Date
  updatedAt?: Date 
  amountRemainsInterest?:number
  amountRemainsPenalty?:number
  amountRemainsBrokenPeriodIntrest?:number
  brokenPeriodIntrest?:number
  accessAmount?:number
  color?: string;
  bgcolor?: string;
  paymentReceived?:number
  is_deleted?: number,
  waive_off_amount?: double
}
 
export type TSelectEmi = keyof IEmi