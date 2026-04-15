import { PanInfoResponseBody } from '../../shared/types/types'
import { guestAxios } from '../utils/guestFetch'

/**
 * 获取分享盘信息（需要取件码）
 */
export async function fetchPanInfoData(code: string) {
  const { data } = await guestAxios.get<PanInfoResponseBody>('/api/list', {
    params: { code },
  })

  return data
}

export default fetchPanInfoData
