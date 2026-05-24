export interface ILenderInfo {
  lenderImage: string
  lenderName: string
  lenderCompanyName: string
  lenderImageWithName: string
  lenderStamp: string
  lenderSign: string
  base_url: string
  lenderRepaymentUrl: string
  lenderSoaImage: string
  lenderEmailId: string
  loan_account_no_prefix: string
  lenderRbiRegnNo:string,
  lenderCinNo:string,
  lenderGstNo:string,
  lenderAddress:string,
  lenderTextColor:string
}
export interface ILender {
  lenderID: number
  name: string
  sanction_letter: string
  kfs_letter: string
  agreement_letter: string
  gst_no: string
  pan_no: string
  credentials: string
  created_date: Date
  iu_date: Date
  lender_info: ILenderInfo
  status: number
}
export type TSelectLender = keyof ILender