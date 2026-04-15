import { ApiResponse } from '../../shared/types/types'
import { adminAxios } from '../utils/adminFetch'

/**
 * 上传文件
 */
export async function uploadFile(
  file: File,
): Promise<ApiResponse<{ key: string; originalName: string; contentType: string; size: number }>> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await adminAxios.post<
    ApiResponse<{ key: string; originalName: string; contentType: string; size: number }>
  >('/api/files/file', formData)

  if (data.code !== 200) {
    throw new Error(data.error || '上传文件失败')
  }

  return data
}
