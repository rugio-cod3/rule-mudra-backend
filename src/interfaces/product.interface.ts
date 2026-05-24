export interface IProduct {
  productID: number // Primary key
  name: string
  logo?: string
  discription?: string
  type?: string
  step?: string
  status?: string
  leadID?: number
  customerID?: number
}

export type TSelectProduct = keyof IProduct
