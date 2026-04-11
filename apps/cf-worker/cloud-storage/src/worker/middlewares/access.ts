import { createMiddleware } from 'hono/factory'
import { GeneralEnv } from '../types/hono'
import genLogger from '../utils/genLogger'

export const accessMiddleware = () =>
  createMiddleware<GeneralEnv>(async (c, next) => {
    const logger = genLogger()

    const method = c.req.method
    const path = c.req.path

    logger.info(`${method} ${path} ...`)

    await next()

    logger.info(`${method} ${path} ... ${c.res.status}`)
  })
