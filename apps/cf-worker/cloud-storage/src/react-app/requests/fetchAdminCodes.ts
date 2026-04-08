import { ApiResponse } from '../../shared/types/types'

export interface AdminCodeItem {
  id: string
  value: string | null
  active: boolean
  panId: string | null
  createdAt: string | number
  updatedAt: string | number
}

export async function fetchAdminCodes(): Promise<ApiResponse<AdminCodeItem[]>> {
  const response = await fetch('/api/admin/codes', {
    credentials: 'include',
  })

  const data: ApiResponse<AdminCodeItem[]> = await response.json()

  if (!response.ok || data.code !== 200) {
    throw new Error(data.error || '获取 Code 列表失败')
  }

  return data
}
