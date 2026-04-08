import { createMiddleware } from 'hono/factory'
import { matchedRoutes } from 'hono/route'
import { HonoEnv } from '../types/hono'

export default function (
  excludeList: string[] | string = [],
  middleware: ReturnType<typeof import('hono/factory').createMiddleware<HonoEnv>>,
) {
  return createMiddleware<HonoEnv>((c, next) => {
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
