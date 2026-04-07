import { ApiResponse } from '../../shared/types/types'

/**
 * 上传文件
 */
export async function uploadFile(
  file: File,
): Promise<ApiResponse<{ key: string; originalName: string; contentType: string; size: number }>> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/files/file', {
    method: 'POST',
    body: formData,
    credentials: 'include', // 确保携带cookie
  })

  if (!response.ok) {
    throw new Error(`上传文件失败: ${response.status} ${response.statusText}`)
  }

  const data: ApiResponse<{
    key: string
    originalName: string
    contentType: string
    size: number
  }> = await response.json()

  if (data.code !== 200) {
    throw new Error(data.error || '上传文件失败')
  }

  return data
}
