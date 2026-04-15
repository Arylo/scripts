import { createMiddleware } from 'hono/factory'
import { GeneralEnv } from '../types/hono'

export const startTimeMiddleware = () =>
  createMiddleware<GeneralEnv>(async (c, next) => {
    const startAt = Date.now()

    c.set('startTime', startAt)

    await next()
  })
