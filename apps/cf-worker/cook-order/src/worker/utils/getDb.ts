import { Logger } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { getContext } from 'hono/context-storage'
import { GeneralEnv } from '../types/hono'
import genLogger from './genLogger'

class D1Logger implements Logger {
  logQuery(query: string, params?: any[]) {
    const logger = genLogger()
    logger.info(`SQL Query: ${query}, Params: ${JSON.stringify(params)}`)
  }
}

export default function getDb() {
  const c = getContext<GeneralEnv>()
  const db = drizzle(c.env.db, { logger: new D1Logger() })
  return db
}
