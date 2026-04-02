import { createMiddleware } from 'hono/factory'
import { HonoEnv } from '../types/hono'

export const startTimeMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    const startAt = Date.now()

    c.set('startTime', startAt)

    await next()
  })
