export interface ILenderCreds {
  lenderID: number
  cred_name: string
  credentials: JSON
  status:number
}

export interface IUpdateLenderCreds {
  lenderID: number
  cred_name: string
  credentials: object
}

export interface IGetLenderCreds {
  leadID: number
}

export type TSelectLenderCreds = keyof ILenderCreds