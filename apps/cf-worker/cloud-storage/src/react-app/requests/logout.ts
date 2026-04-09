import { ApiResponse } from '../../shared/types/types'

export async function logout(): Promise<ApiResponse<null>> {
  const response = await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'include',
  })

  const data: ApiResponse<null> = await response.json()
  return data
}
