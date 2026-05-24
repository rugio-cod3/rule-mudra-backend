export interface ICustomerAppLocation {
  id?: number
  mobile: number
  customerID: number
  residenceAddress: string
  state: string
  city: string
  pincode: number
  created_at?: Date
}
export type TSelectCustomerAppLocation = keyof ICustomerAppLocation
