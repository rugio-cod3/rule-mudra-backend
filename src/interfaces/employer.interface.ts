export interface IEmployer {
  employerID: number
  customerID: number
  employerName: string
  empEmail: string
  empDob: string
  empSalary: string
  empDesignation: string
  empWorkIndustry: string
  employment: string
  totalExperience: string
  currentCompany: string
  address: string
  city: string
  state: string
  pincode: bigint
  status: 'Verified' | 'Not Verified'
  verifiedBy: number
  createdDate: Date
  office_email_id: string
  office_email_otp: string
  is_verified_email: 'No' | 'Yes'
}
export type TSelectEmployer = keyof IEmployer
