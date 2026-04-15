import { ApiResponse } from '../../shared/types/types'
import { guestAxios } from '../utils/guestFetch'

export async function deleteFileGuest(originalName: string): Promise<ApiResponse<void>> {
  const { data } = await guestAxios.delete<ApiResponse<void>>(
    `/api/list/files/${encodeURIComponent(originalName)}`,
  )
  return data
}

export default deleteFileGuest
