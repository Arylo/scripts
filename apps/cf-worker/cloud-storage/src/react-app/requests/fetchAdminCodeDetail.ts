import { ApiResponse } from '../../shared/types/types'
import { adminAxios } from '../utils/adminFetch'
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
  const { data } = await adminAxios.get<ApiResponse<AdminCodeDetailData>>(
    `/api/admin/pans/${panId}/codes/${codeId}`,
  )

  if (data.code !== 200) {
    throw new Error(data.error || '获取 Code 详情失败')
  }

  return data
}
