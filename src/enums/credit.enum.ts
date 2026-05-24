export enum CreditStatus {
  DISBURSED = 'disbursed',
}
export enum Charges {
  ADMIN_PERCENTAGE = 0.1,
  GST = 0.18,
  ADMIN_PERCENTAGE_MAX_TENURE= 0.1
}
export const TenureMaxEmi = {
  REPAY_DATES: [1, 8, 18] as const,
  MIN_DIFF : 30
};
