export interface IPermission {
  permission_id: number
  permission_name: string
  permission_display_name: string
  permission_type: string
  status: number
  created_by: number | null
  created_at: string
  updated_at: string | null
  updated_by: number | null
}

export type TSelectPermission = keyof IPermission

export interface IGetPermissionsListQuery {
  permission_search?: string
  limit?: number
  page?: number
}

export interface IUpdateOrAddPermissionDetails {
  permission_name?: string
  permission_display_name?: string
  permission_type?: string
  status?: 'Active' | 'In Active'
}

export interface IUpdatePermissionAccess {
  name: string
  isChecked: boolean
}

export interface IPermissionItem {
  id: number
  name: string
  display_name: string
  isChecked: boolean
}

export interface IPermissionGroupByType {
  name: string
  data: IPermissionItem[]
}
