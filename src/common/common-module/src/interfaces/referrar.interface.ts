export interface IReferrarModel {
  id?: number
  customer_id: number
  referral_code: string
  is_pan_verified?: boolean
  is_bank_verified?: boolean
  is_penny_done?: boolean
  created_at?: Date & string
  updated_at?: Date & string
}

export type TSelectReferrar = keyof IReferrarModel
