import { Roles } from '../enums/roles.enum'

export interface IRole {
  role_id: number
  role_name: Roles
  role_display_name: string
  status: 1 | 0
  created_at: Date
  created_by: number
  updated_at: Date
  updated_by: number
  // iu_date: Date
}

export type TSelectRole = keyof IRole

export interface IGetRolesListQuery {
  role_search?: string
  limit?: number
  page?: number
}

export interface IAddOrUpdateRoleDetails {
  role_name?: Roles
  role_display_name?: string
  status?: 'Active' | 'In Active'
}
