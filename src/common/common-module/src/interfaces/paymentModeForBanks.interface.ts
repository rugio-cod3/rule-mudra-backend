export interface IPaymentModeForBanks {
  id?: number
  bank_name?: string
  payment_mode?: string
  created_by?: number
  created_date?: Date
  updated_by?: number
  updated_date?: Date
  status?: string
  id_date?: Date
}

export type TSelectPaymentModeForBanks = keyof IPaymentModeForBanks
