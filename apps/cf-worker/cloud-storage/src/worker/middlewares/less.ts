import { createMiddleware } from 'hono/factory'
import { matchedRoutes } from 'hono/route'
import { GeneralEnv } from '../types/hono'

export default function <E extends GeneralEnv = GeneralEnv>(
  excludeList: string[] | string = [],
  middleware: ReturnType<typeof createMiddleware<E>>,
) {
  return createMiddleware<E>((c, next) => {
    const routes = matchedRoutes(c)
    const excludePaths = Array.isArray(excludeList) ? excludeList : [excludeList]

    if (
      excludePaths.some((excludePath) =>
        routes.some((route) => route.path === `${route.basePath}${excludePath}`),
      )
    ) {
      return next()
    }
    return middleware(c, next)
  })
}
