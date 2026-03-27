import { AppContext } from '../frame/app'
import { getKV } from '../getKV'
import { getLogger } from '../middlewares/logger'
import getCookiePwd from './getCookiePwd'
import throws from './throws'

export default async function getKeyWithPrefixes(
  ctx: AppContext,
  firstKey?: string,
): Promise<[string, string[]]> {
  const logger = getLogger(ctx)
  const cookieContent = getCookiePwd(ctx)

  const pwdToUse = firstKey || cookieContent
  if (!pwdToUse) {
    return throws.Forbidden(ctx, 'Forbidden')
  }
  logger.info('pwdToUse:', pwdToUse)

  const pwdHash = await crypto.subtle.digest('MD5', new TextEncoder().encode(pwdToUse!))
  const hashArray = Array.from(new Uint8Array(pwdHash))
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
  logger.info('hashHex:', hashHex)

  const kv = getKV(ctx.env, ctx.env.KV_NAMESPACE)
  const storedPrefixes = (await kv.get(hashHex)) ?? ''

  if (!storedPrefixes) {
    throws.NotFound(ctx, 'Not Found')
  }

  let prefixes: string[] = []

  try {
    prefixes = JSON.parse(storedPrefixes!)
  } catch {
    throws.Forbidden(ctx, 'Forbidden')
  }

  if (prefixes.length === 0) {
    throws.NotFound(ctx, 'Not Found')
  }
  logger.info('prefixes:', prefixes)

  return [pwdToUse, prefixes] as const
}
