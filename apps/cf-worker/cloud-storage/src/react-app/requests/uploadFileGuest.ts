import { ApiResponse } from '../../shared/types/types'
import { guestAxios } from '../utils/guestFetch'

/**
 * 上传文件（GuestPage 版本）
 */
export async function uploadFileGuest(
  file: File,
): Promise<ApiResponse<{ key: string; originalName: string; contentType: string; size: number }>> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await guestAxios.post<
    ApiResponse<{ key: string; originalName: string; contentType: string; size: number }>
  >('/api/files/file', formData)

  return data
}

export default uploadFileGuest
