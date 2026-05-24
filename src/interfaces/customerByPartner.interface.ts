export interface ICustomerByPartnerModel {
  id?: number
  mobile: number
  email: string
  utmSource: string
  uatMedium: string
  loanRequiered: string
  pancard: string
  adId: string
  camp: string
  campID: string
  channel: string
  pid: string
  ip_address: string
  created_at: Date
  iu_date: Date
}

export type TSelectCustomerByPartner = keyof ICustomerByPartnerModel
