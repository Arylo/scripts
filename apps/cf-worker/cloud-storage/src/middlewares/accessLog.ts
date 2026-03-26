import { type AppContext } from '../frame/app'
import { getLogger } from './logger'

export default function accessLogMiddleware() {
  return async (ctx: AppContext, next: () => Promise<void>) => {
    const startTime = Date.now()

    try {
      getLogger(ctx).info(`${ctx.method} ${ctx.path} ...`)
      await next()
    } finally {
      const endTime = Date.now()
      const responseTime = endTime - startTime

      // 获取最终状态码，优先使用response对象的状态码
      const finalStatus = ctx.response?.status || ctx.status

      // 记录访问日志
      getLogger(ctx).info(`${ctx.method} ${ctx.path} ... ${finalStatus} ${responseTime}ms`)
    }
  }
}
