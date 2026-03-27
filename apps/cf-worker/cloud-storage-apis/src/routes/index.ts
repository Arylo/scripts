import App from '../frame/app'
import accessLogMiddleware from '../middlewares/accessLog'
import cookiePwd from '../middlewares/cookiePwd'
import loggerMiddleware from '../middlewares/logger'
import poweredByMiddleware from '../middlewares/poweredBy'
import sessionMiddleware from '../middlewares/session'
import filepathRoute from './filepath'
import listRoute from './list'

export default async function routes(
  ...args: ConstructorParameters<typeof App>
): Promise<Response> {
  const [request, env, ctx] = args
  const app = new App(request, env, ctx)

  app.use(sessionMiddleware())
  app.use(loggerMiddleware())
  app.use(poweredByMiddleware())
  app.use(accessLogMiddleware())

  app.onError((error) => {
    if (error instanceof Error) {
      console.error(error)
    }

    // Let the default error handler handle it
    return undefined
  })

  app.use(cookiePwd())

  listRoute(app)
  filepathRoute(app)

  return app.start()
}
