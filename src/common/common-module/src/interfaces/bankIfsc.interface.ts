export interface IBankIfscModel {
  id?: number
  BANK?: string // varchar(57)
  IFSC?: string // varchar(11)
  BRANCH?: string // varchar(87)
  CENTRE?: string // varchar(48)
  DISTRICT?: string // varchar(48)
  STATE?: string // varchar(40)
  ADDRESS?: string // varchar(208)
  CONTACT?: string // varchar(21)
  IMPS?: string // varchar(5)
  RTGS?: string // varchar(5)
  CITY?: string // varchar(48)
  ISO3166?: string // varchar(7)
  NEFT?: string // varchar(5)
  MICR?: string // varchar(9)
  UPI?: string // varchar(5)
  SWIFT?: string // varchar(255)
  is_active: '0' | '1'
}

export type TSelectBankIfscModel = keyof IBankIfscModel
