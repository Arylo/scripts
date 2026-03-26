import { AppContext } from '../frame/app'
import { getKV } from '../getKV'
import throws from './throws'

export default async function getKvPrefixes(ctx: AppContext, key: string): Promise<string[]> {
  if (!key) return []
  const pwdHash = await crypto.subtle.digest('MD5', new TextEncoder().encode(key))
  const hashArray = Array.from(new Uint8Array(pwdHash))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  const kv = getKV(ctx.env, ctx.env.KV_NAMESPACE)
  const storedPrefixes = await kv.get(hashHex)

  if (!storedPrefixes) return []
  try {
    return JSON.parse(storedPrefixes)
  } catch {
    throws.Forbidden(ctx, 'Forbidden')
  }
  return []
}
