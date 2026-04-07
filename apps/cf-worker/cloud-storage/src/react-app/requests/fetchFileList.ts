import { FileInfo, ListFilesRequestBody, ListFilesResponseBody } from '../../shared/types/types'

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
