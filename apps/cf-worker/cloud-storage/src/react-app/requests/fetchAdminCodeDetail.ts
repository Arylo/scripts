import { ApiResponse } from '../../shared/types/types'
import { AdminPermItem } from './fetchAdminPanDetail'

export interface AdminCodeDetailData {
  id: string
  value: string | null
  active: boolean
  createdAt: string | number
  updatedAt: string | number
  perms: AdminPermItem[]
}

export async function fetchAdminCodeDetail(
  panId: string,
  codeId: string,
): Promise<ApiResponse<AdminCodeDetailData>> {
  const response = await fetch(`/api/admin/pans/${panId}/codes/${codeId}`, {
    credentials: 'include',
  })

  const data: ApiResponse<AdminCodeDetailData> = await response.json()

  if (!response.ok || data.code !== 200) {
    throw new Error(data.error || '获取 Code 详情失败')
  }

  return data
}
