import { createMiddleware } from 'hono/factory'
import type { AuthConfig } from '../../shared/types/types'
import { HonoEnv } from '../types/hono'
import genLogger from '../utils/genLogger'

const COOKIE_NAME = 'share_token'

async function getAuthConfig(env: Env, key: string): Promise<AuthConfig | null> {
  try {
    const configStr = await env.AUTH_KV.get(key)
    if (!configStr) return null
    return JSON.parse(configStr) as AuthConfig
  } catch (error) {
    console.error('Error parsing auth config:', error)
    return null
  }
}

async function md5Hash(input: string): Promise<string> {
  // 使用Web Crypto API进行MD5哈希
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('MD5', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const authMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    const logger = genLogger()
    const cookieValue = c.req.header('cookie')

    if (!cookieValue) {
      logger.error('Missing cookie in request')
      return c.json({ code: 400, error: 'Missing cookie' }, 400)
    }

    // 从cookie中提取会话值
    const cookieMatch = cookieValue.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
    if (!cookieMatch) {
      logger.error('Invalid cookie format')
      return c.json({ code: 400, error: 'Invalid cookie format' }, 400)
    }

    const hashedKey = cookieMatch[1].toUpperCase()
    const kvKey = `key_${hashedKey}`
    logger.info(`Extracted hashed key: ${hashedKey} from cookie`)
    logger.info(`Looking up KV with key: ${kvKey}`)

    const authConfig = await getAuthConfig(c.env, kvKey)
    if (!authConfig) {
      return c.json({ code: 404, error: 'hashed key not found' }, 404)
    }

    c.set('authConfig', authConfig)
    c.set('hashedKey', hashedKey.toUpperCase())

    await next()
  })

export const loginMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    const logger = genLogger()
    const body: { pwd?: string } = await c.req.json<{ pwd?: string }>().catch(() => ({}))

    if (!body.pwd) {
      return c.json({ code: 400, error: 'Missing key code' }, 400)
    } else {
      logger.info('Received key code', body.pwd)
    }

    const hashedKey = await md5Hash(body.pwd)
    const kvKey = `key_${hashedKey.toUpperCase()}`

    logger.info(`Generated hashed Key: ${hashedKey}`)
    logger.info(`Looking up KV with key: ${kvKey} for form data`)

    const authConfig = await getAuthConfig(c.env, kvKey)
    if (!authConfig) {
      return c.json({ code: 404, error: 'Invalid Key' }, 404)
    }

    c.set('authConfig', authConfig)
    c.set('hashedKey', hashedKey.toUpperCase())
    c.res.headers.set('Set-Cookie', `${COOKIE_NAME}=${hashedKey}; Path=/; HttpOnly; Max-Age=86400`)

    await next()
  })
