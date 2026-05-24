export interface IAddress {
  addressID?: number
  customerID: number
  type: 'Permanent Address' | 'Current Address' | 'Rent' | 'Owned'
  address?: string
  city?: string
  state?: string
  pincode?: bigint | number
  status?: 'Verified' | 'Not Verified'
  verifiedBy?: number
  createdDate?: Date
  address2?: string
  landmark?: string
  area?: string
  region?: string
  fetchedBy?: string
}
export interface IDashboardPayload {
  residenceAddress: string
  state: string
  city: string
  pincode: number
  appVersion: string
}

export type TSelectAddress = keyof IAddress
