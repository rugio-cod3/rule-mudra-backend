export interface IPaymentMode {
  id?: number
  mode: string
  status: string
  id_date?: Date
}

export type TSelectPaymentMode = keyof IPaymentMode
