import SHA1 from 'crypto-js/sha1'
import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { ulid } from 'ulid'
import { AdminEnv } from '../types/hono'
import genLogger from '../utils/genLogger'

function sha1Hash(input: string): string {
  return SHA1(input).toString()
}

export const COOKIE_NAME = 'user_token'

const VALID_DURATION = 4 * 60 * 60 * 1000

export const adminAuthMiddleware = () =>
  createMiddleware<AdminEnv>(async (c, next) => {
    const logger = genLogger()

    const userToken = getCookie(c, COOKIE_NAME)
    logger.info(`Extracted user_token: ${userToken} from cookie`)

    if (!userToken || userToken.trim() === '') {
      return c.json({ code: 401, error: 'Unauthorized: Invalid user_token' }, 401)
    }

    const sessionDataStr = await c.env.AUTH_KV.get(`session_${userToken}`)
    logger.info(`Fetched session data from KV for token ${userToken}: ${sessionDataStr}`)

    if (!sessionDataStr) {
      return c.json({ code: 401, error: 'Unauthorized: Session not found' }, 401)
    }

    // 将user_token设置到上下文中，供后续使用
    c.set('userToken', userToken)

    await next()
  })

export const adminLoginMiddleware = () =>
  createMiddleware<AdminEnv>(async (c) => {
    const logger = genLogger()
    try {
      const body = await c.req.json<{ username?: string; password?: string }>()

      // 检查请求体
      if (!body.username || !body.password) {
        return c.json({ code: 400, error: 'Missing username or password' }, 400)
      }

      const { username, password } = body

      // 验证用户名和密码
      if (username !== c.env.USERNAME) {
        logger.error(`Invalid username: ${username}`)
        return c.json({ code: 401, error: 'Invalid user' }, 401)
      }

      const passwordHash = password
      const expectedPasswordHash = sha1Hash(c.env.PASSWORD)

      if (passwordHash !== expectedPasswordHash) {
        return c.json({ code: 401, error: 'Invalid user' }, 401)
      }

      const timestamp = Date.now()
      const sessionToken = ulid()

      const sessionData = {
        username,
        createdAt: timestamp,
        expiresAt: timestamp + VALID_DURATION,
      }

      await c.env.AUTH_KV.put(`session_${sessionToken}`, JSON.stringify(sessionData), {
        expirationTtl: VALID_DURATION / 1000,
      })

      setCookie(c, COOKIE_NAME, sessionToken, {
        path: '/api/admin',
        httpOnly: true,
        secure: true,
        maxAge: VALID_DURATION / 1000,
      })
      return c.json({
        code: 200,
        message: 'Login successful',
        data: {
          token: sessionToken,
          expiresAt: sessionData.expiresAt,
        },
      })
    } catch (error) {
      logger.error('Error in login:', error)
      return c.json({ code: 500, error: 'Failed to process login request' }, 500)
    }
  })

export const adminLogoutMiddleware = () =>
  createMiddleware<AdminEnv>(async (c) => {
    const logger = genLogger()
    const userToken = c.get('userToken')

    if (!userToken) {
      logger.error('No user token found for logout')
      return c.json({ code: 400, error: 'No active session found' }, 400)
    }

    try {
      await c.env.AUTH_KV.delete(`session_${userToken}`)
      logger.info(`Deleted session data for token: ${userToken}`)

      setCookie(c, COOKIE_NAME, '', {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 0,
        expires: new Date(0),
      })

      return c.json({
        code: 200,
        message: 'Logout successful',
        data: {
          timestamp: Date.now(),
        },
      })
    } catch (error) {
      logger.error(`Error during logout: ${error}`)
      return c.json({ code: 500, error: 'Failed to process logout request' }, 500)
    }
  })
