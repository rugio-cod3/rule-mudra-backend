import { ReferralRedeemStatus, ReferralStatus } from '../enums/referral.enum'

export interface IReferralModel {
  id?: number
  referrar_id: number
  referrar_customer_id: number
  referreCustomerId: number
  status?: ReferralStatus
  referral_bonus?: boolean
  created_at?: Date & string
  updated_at?: Date & string
  redeem_status?: ReferralRedeemStatus
}

export type TSelectReferral = keyof IReferralModel

export interface IReferralStages {
  Joined: boolean
  "KYC Verification": boolean
  "Apply Loan": boolean
  Rejected: boolean
  Approved: boolean
  Disbursal: boolean
}