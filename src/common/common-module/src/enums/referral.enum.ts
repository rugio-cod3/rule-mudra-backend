import { IReferralStages } from '../interfaces/referral.interface'

export enum ReferralStatus {
  WAITING_TO_JOIN = 'Waiting to join',
  JOINED = 'Joined',
  COMPLETED = 'Completed',
}

export enum ReferralRedeemStatus {
  PENDING = 'Pending',
  REDEEMED = 'Redeemed',
  REDEEMABLE = 'Redeemable',
  NOT_REDEEMABLE = 'Not Redeemable',
}

export const ReferralStages = (): IReferralStages => {
  return {
    Joined: false,
    "KYC Verification": false,
    "Apply Loan": false,
    Rejected: false,
    Approved: false,
    Disbursal: false,
  }
}
