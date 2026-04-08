import { ApiResponse } from '../../shared/types/types'

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
  const response = await fetch(`/api/admin/pans/${panId}`, {
    credentials: 'include',
  })

  const data: ApiResponse<AdminPanDetailData> = await response.json()

  if (!response.ok || data.code !== 200) {
    throw new Error(data.error || '获取 Pan 详情失败')
  }

  return data
}
