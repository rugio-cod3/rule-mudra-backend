import { IUpdatePermissionAccess } from './permissions.interface'

export interface IUser {
  userID: number
  name: string
  email: string
  mobile: number
  did_no?: string | null
  branch: string
  userName: string
  password: string
  role: string
  status: 'Active' | 'In Active'
  createdBy: number
  createdDate: Date
  accessPer: string
  utype: string
  firebase_token?: string | null
  device_token?: string | null
  lip: string
  convoque_login_id?: string | null
  convoque_exten?: string | null
  whatsapp_email?: string | null
  lead_status: string
  otp?: number | null
  password_updated_at?: Date | null
  mac_address?: string | null
  random_id?: string | null
  mac_otp?: string | null
  utmSource?: string | null
}

export type TSelectUser = keyof IUser

export type TUserSearchBy = 'name' | 'mobile' | 'email' | 'userName'

export interface IGetManagementUserListQuery {
  search_by?: TUserSearchBy
  customer_search?: string
  role?: string
  status?: 'Active' | 'In Active' | 'All'
  limit?: number
  page?: number
  isExcelDownload?: boolean
}

export interface IGetLoginLogsQuery {
  customer_search?: string
  limit?: number
  page?: number
}

export interface IWhitelistIP {
  id?: number
  ip?: string
  status?: string
  // created_date?: Date
  // iu_date: Date
}

export interface IUpdateOrAddManagementUserListSchema {
  name?: string
  email?: string
  mobile?: number
  did_no?: string
  userName?: string
  password?: string
  branch?: string
  role_id?: number
  status?: 'Active' | 'In Active'
  convoque_login_id?: string
  convoque_exten?: string
  whatsapp_email?: string
  accessPer?: IUpdatePermissionAccess[]
}

export type TSelectWhitelistIP = keyof IWhitelistIP
