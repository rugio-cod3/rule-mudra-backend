export interface IAttempt {
  id?: number
  mobile: bigint
  log_datetime: Date
}
export type TSelectAttempt = keyof IAttempt
