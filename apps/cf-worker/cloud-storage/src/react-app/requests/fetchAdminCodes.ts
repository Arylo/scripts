import { ApiResponse } from '../../shared/types/types'
import { adminAxios } from '../utils/adminFetch'

export interface AdminCodeItem {
  id: string
  value: string | null
  active: boolean
  panId: string | null
  createdAt: string | number
  updatedAt: string | number
}

export async function fetchAdminCodes(): Promise<ApiResponse<AdminCodeItem[]>> {
  const { data } = await adminAxios.get<ApiResponse<AdminCodeItem[]>>('/api/admin/codes')

  if (data.code !== 200) {
    throw new Error(data.error || '获取 Code 列表失败')
  }

  return data
}
