export const nameCheckPercentage = 70
export enum NameSimilarityStatus {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}
export enum NameMatchType {
  PENNY_DROP_PAN = 'penny drop - pan',
  PENNY_DROP_AADHAR = 'penny drop - aadhar',
  BANK_NAME_PAN = 'bank account - pan',
  BANK_NAME_AADHAR = 'bank account - pan',
  KFS = 'KFS',
  PENNY_DROP_CUSTOMER_NAME='penny drop - customer name'
}

export enum FinboxUrls {
  CREATE_URL = '/back_to_application',
  LOGO_URL = '/loanapply/public/logo.png',
}

export enum FinBoxBankConnectProgressStatus {
  PROCESSING = 'processing',
  FAILED = 'failed',
}

export enum DateDifference{
  LESSER = 6,
  GREATER = 36
}


