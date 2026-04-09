import { ApiResponse } from '../../shared/types/types'
import { adminAxios } from '../utils/adminFetch'

export interface AdminPermItem {
  id: string
  type: string
  value: string
  createdAt: string | number
  updatedAt: string | number
}

export interface AdminCodeItem {
  id: string
  value: string | null
  active: boolean
  createdAt: string | number
  updatedAt: string | number
}

interface AdminPanDetailData {
  id: string
  active: boolean
  createdAt: string | number
  updatedAt: string | number
  perms: AdminPermItem[]
  codes: AdminCodeItem[]
}

export async function fetchAdminPanDetail(panId: string): Promise<ApiResponse<AdminPanDetailData>> {
  const { data } = await adminAxios.get<ApiResponse<AdminPanDetailData>>(`/api/admin/pans/${panId}`)

  if (data.code !== 200) {
    throw new Error(data.error || '获取分享盘详情失败')
  }

  return data
}
