import { ApiResponse } from '../../shared/types/types'

export interface AdminPanItem {
  id: string
  active: boolean
  createdAt: string | number
  updatedAt: string | number
}

export async function fetchAdminPans(): Promise<ApiResponse<AdminPanItem[]>> {
  const response = await fetch('/api/admin/pans', {
    credentials: 'include',
  })

  const data: ApiResponse<AdminPanItem[]> = await response.json()

  if (!response.ok || data.code !== 200) {
    throw new Error(data.error || '获取 Pan 列表失败')
  }

  return data
}
