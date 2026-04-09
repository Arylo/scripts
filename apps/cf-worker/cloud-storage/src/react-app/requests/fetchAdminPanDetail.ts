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

export interface AdminDocItem {
  id: string
  hash: string
  mimetype: string
  size: number
  createdAt: string | number
  updatedAt: string | number
  originalName: string
  highlight: boolean
}

interface AdminPanDetailData {
  id: string
  active: boolean
  createdAt: string | number
  updatedAt: string | number
  perms: AdminPermItem[]
  codes: AdminCodeItem[]
  docs: AdminDocItem[]
}

export async function fetchAdminPanDetail(panId: string): Promise<ApiResponse<AdminPanDetailData>> {
  const { data } = await adminAxios.get<ApiResponse<AdminPanDetailData>>(`/api/admin/pans/${panId}`)

  if (data.code !== 200) {
    throw new Error(data.error || '获取分享盘详情失败')
  }

  return data
}

export async function deleteAdminPanFile(panId: string, fileHash: string): Promise<void> {
  const { data } = await adminAxios.delete<ApiResponse<void>>(
    `/api/admin/pans/${panId}/files/${fileHash}`,
  )

  if (data.code !== 200) {
    throw new Error(data.error || '删除文件失败')
  }
}
