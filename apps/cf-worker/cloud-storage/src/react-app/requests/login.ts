import SHA1 from 'crypto-js/sha1'
import { ApiResponse } from '../../shared/types/types'

export async function login(username: string, password: string): Promise<ApiResponse<null>> {
  const passwordHash = SHA1(password).toString()

  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: passwordHash }),
    credentials: 'include',
  })

  const data: ApiResponse<null> = await response.json()
  return data
}
