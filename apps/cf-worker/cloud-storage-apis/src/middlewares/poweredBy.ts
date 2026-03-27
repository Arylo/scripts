import { type AppContext } from '../frame/app'

export default function poweredByMiddleware() {
  return async (ctx: AppContext, next: () => Promise<void>) => {
    ctx.set('X-Powered-By', 'cf-worker-app')
    await next()
  }
}
