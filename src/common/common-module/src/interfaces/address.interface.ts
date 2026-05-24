import { AddressStatus, AddressType } from '../enums/lead.enum'
export interface IAddress {
  addressID?: number
  customerID: number
  type: AddressType
  address?: string
  city?: string
  state?: string
  pincode?: number
  status?: AddressStatus
  verifiedBy?: number
  createdDate?: Date
  address2?: string
  landmark?: string
  area?: string
  region?: string
  fetchedBy?: string
}

export type TSelectAddress = keyof IAddress
