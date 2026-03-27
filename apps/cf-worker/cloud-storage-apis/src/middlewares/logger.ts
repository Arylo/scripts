import { type AppContext } from '../frame/app'

export function getLogger(ctx: AppContext) {
  return ctx.state.logger as {
    log: (message: string, ...args: any[]) => void
    info: (message: string, ...args: any[]) => void
    warn: (message: string, ...args: any[]) => void
    error: (message: string, ...args: any[]) => void
    debug: (message: string, ...args: any[]) => void
  }
}

export default function loggerMiddleware() {
  return async (ctx: AppContext, next: () => Promise<void>) => {
    const sessionId = ctx.state.sessionId as string
    const requestId = ctx.state.requestId as string
    const startDate = ctx.state.startDate as number
    const logger = {
      log: (message: string, ...args: any[]) => {
        const timestamp = new Date().toISOString()
        console.log(
          `${timestamp} - [${sessionId}][${requestId}][${Date.now() - startDate}][DEBUG] ${message}`,
          ...args,
        )
      },
      info: (message: string, ...args: any[]) => {
        const timestamp = new Date().toISOString()
        console.log(
          `${timestamp} - [${sessionId}][${requestId}][${Date.now() - startDate}][INFO] ${message}`,
          ...args,
        )
      },
      warn: (message: string, ...args: any[]) => {
        const timestamp = new Date().toISOString()
        console.warn(
          `${timestamp} - [${sessionId}][${requestId}][${Date.now() - startDate}][WARN] ${message}`,
          ...args,
        )
      },
      error: (message: string, ...args: any[]) => {
        const timestamp = new Date().toISOString()
        console.error(
          `${timestamp} - [${sessionId}][${requestId}][${Date.now() - startDate}][ERROR] ${message}`,
          ...args,
        )
      },
      get debug() {
        return logger.log
      },
    }
    ctx.state.logger = logger

    await next()
  }
}
