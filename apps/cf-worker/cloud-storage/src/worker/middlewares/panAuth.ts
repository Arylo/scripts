import { and, eq, getTableColumns } from 'drizzle-orm'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { ulid } from 'ulid'
import { STATUS_CODE, STATUS_MAP } from '../../shared/constant/guest'
import { Code } from '../models/Code'
import { Pan } from '../models/Pan'
import { PanCode } from '../models/PanCode'
import { GuestEnv } from '../types/hono'
import genLogger from '../utils/genLogger'
import getDb from '../utils/getDb'

export const COOKIE_NAME = 'share_token'

const SESSION_VALID_DURATION = 2 * 60 * 60 * 1000 // 2h
const SESSION_CACHE_TTL = 5 * 60 // 5m

export const panAuthMiddleware = () =>
  createMiddleware<GuestEnv>(async (c, next) => {
    const logger = genLogger()

    const sessionToken = getCookie(c, COOKIE_NAME)
    if (!sessionToken) {
      logger.warn('No share token provided')
      return c.json({ code: 404, error: 'Not found' }, 404)
    }

    const sessionDataStr = await c.env.AUTH_KV.get(`session_${sessionToken}`, {
      cacheTtl: SESSION_CACHE_TTL,
    })
    if (!sessionDataStr) {
      logger.warn(`No session found for token ${sessionToken}`)
      return c.json({ code: 404, error: 'Not found' }, 404)
    }

    const sessionData = JSON.parse(sessionDataStr)
    const { panId, codeId } = sessionData

    c.set('panId', panId)
    c.set('codeId', codeId)
    c.set('sharedToken', sessionToken)

    await next()
  })

export const panPickMiddleware = () =>
  createMiddleware<GuestEnv>(async (c, next) => {
    const logger = genLogger()
    const code = c.req.query('code')

    if (!code) {
      return c.json({ code: STATUS_CODE.MISS_CODE, error: STATUS_MAP[STATUS_CODE.MISS_CODE] }, 400)
    } else if (code.length < 6) {
      return c.json(
        {
          code: 404,
          error: 'Code not found',
        },
        404,
      )
    }
    logger.info('Received key code', code)

    let sessionToken = getCookie(c, COOKIE_NAME)
    let panId: string | undefined
    let codeId: string | undefined

    if (sessionToken) {
      const sessionDataStr = await c.env.AUTH_KV.get(`session_${sessionToken}`, {
        cacheTtl: SESSION_CACHE_TTL,
      })
      if (sessionDataStr) {
        const sessionData = JSON.parse(sessionDataStr)
        const { panId: sessionPanId, codeId: sessionCodeId, code: sessionCode } = sessionData
        if (sessionCode === code) {
          panId = sessionPanId
          codeId = sessionCodeId

          const [isActive] = await getDb()
            .select({
              codeActive: Code.active,
              panActive: Pan.active,
            })
            .from(PanCode)
            .innerJoin(Code, and(eq(PanCode.codeId, Code.id), eq(Code.active, true)))
            .innerJoin(Pan, and(eq(PanCode.panId, Pan.id), eq(Pan.active, true)))
            .where(and(eq(PanCode.codeId, codeId!), eq(PanCode.panId, panId!)))
            .limit(1)

          if (!isActive) {
            deleteCookie(c, COOKIE_NAME)
            return c.json(
              { code: STATUS_CODE.INVALID_CODE, error: STATUS_MAP[STATUS_CODE.INVALID_CODE] },
              403,
            )
          }
        }
      }
    }

    if (!panId || !codeId) {
      const db = getDb()
      const [codeRecord] = await db
        .select({
          ...getTableColumns(Code),
          pan: getTableColumns(Pan),
        })
        .from(Code)
        .innerJoin(PanCode, eq(Code.id, PanCode.codeId))
        .innerJoin(Pan, eq(PanCode.panId, Pan.id))
        .where(eq(Code.value, code))
        .limit(1)

      if (!codeRecord) {
        logger.warn(`Invalid code ${code}`)
        return c.json(
          { code: STATUS_CODE.INVALID_CODE, error: STATUS_MAP[STATUS_CODE.INVALID_CODE] },
          404,
        )
      }
      if (!codeRecord.active || !codeRecord.pan.active) {
        logger.warn(`pan active ${codeRecord.pan.active}, code active ${codeRecord.active}`)
        return c.json(
          { code: STATUS_CODE.INVALID_CODE, error: STATUS_MAP[STATUS_CODE.INVALID_CODE] },
          403,
        )
      }

      const timestamp = Date.now()
      panId = codeRecord.pan.id
      codeId = codeRecord.id
      sessionToken = ulid()

      const sessionData = {
        panId,
        codeId,
        code,
        createdAt: timestamp,
        expiresAt: timestamp + SESSION_VALID_DURATION,
      }

      await c.env.AUTH_KV.put(`session_${sessionToken}`, JSON.stringify(sessionData), {
        expirationTtl: SESSION_VALID_DURATION / 1000,
      })

      setCookie(c, COOKIE_NAME, sessionToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: SESSION_VALID_DURATION / 1000,
      })
    }

    c.set('panId', panId)
    c.set('codeId', codeId)
    c.set('sharedToken', sessionToken!)

    await next()
  })
