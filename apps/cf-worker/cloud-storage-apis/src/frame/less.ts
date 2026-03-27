import { AppContext } from './app'

export default function less(
  middleware: (ctx: AppContext, next: () => Promise<void>) => Promise<void>,
  whiteList: string[] = [],
) {
  return async (ctx: AppContext, next: () => Promise<void>) => {
    if (whiteList.includes(ctx.path)) {
      await next()
      return
    }

    return middleware(ctx, next)
  }
}
