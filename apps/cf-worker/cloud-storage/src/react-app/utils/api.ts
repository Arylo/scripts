import {
  FileInfo,
  ListFilesRequestBody,
  ListFilesResponseBody,
  ApiResponse,
} from '../../types/types.d'

/**
 * 获取文件列表（需要取件码）
 */
export async function fetchFileList(code: string): Promise<FileInfo[]> {
  const requestBody: ListFilesRequestBody = { pwd: code }

  const response = await fetch('/api/files/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error(`获取文件列表失败: ${response.status} ${response.statusText}`)
  }

  const data: ListFilesResponseBody = await response.json()

  if (data.code !== 200) {
    throw new Error(data.error || '获取文件列表失败')
  }

  return data.data || []
}

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
