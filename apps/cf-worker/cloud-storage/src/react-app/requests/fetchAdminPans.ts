import { ApiResponse } from '../../shared/types/types'
import { adminAxios } from '../utils/adminFetch'

export interface AdminPanItem {
  id: string
  active: boolean
  createdAt: string | number
  updatedAt: string | number
}

export async function fetchAdminPans(): Promise<ApiResponse<AdminPanItem[]>> {
  const { data } = await adminAxios.get<ApiResponse<AdminPanItem[]>>('/api/admin/pans')

  if (data.code !== 200) {
    throw new Error(data.error || '获取分享盘列表失败')
  }

  return data
}

export async function createAdminPan(): Promise<ApiResponse<AdminPanItem>> {
  const { data } = await adminAxios.post<ApiResponse<AdminPanItem>>('/api/admin/pans')

  if (data.code !== 200) {
    throw new Error(data.error || '创建分享盘失败')
  }

  return data
}

export async function deleteAdminPan(panId: string): Promise<void> {
  const { data } = await adminAxios.delete<ApiResponse<void>>(`/api/admin/pans/${panId}`)

  if (data.code !== 200) {
    throw new Error(data.error || '删除分享盘失败')
  }
}
