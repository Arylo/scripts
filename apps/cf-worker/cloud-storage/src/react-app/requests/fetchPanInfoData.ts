import { PanInfoResponseBody } from '../../shared/types/types'

/**
 * 获取分享盘信息（需要取件码）
 */
export async function fetchPanInfoData(code: string) {
  const response = await fetch(`/api/list?code=${code}`)

  if (!response.ok) {
    throw new Error(`获取分享盘数据失败: ${response.status} ${response.statusText}`)
  }

  const data: PanInfoResponseBody = await response.json()

  if (data.code !== 200) {
    throw new Error(data.error || '获取文件列表失败')
  }

  return data
}

export default fetchPanInfoData
