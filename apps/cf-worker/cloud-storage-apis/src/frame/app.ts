type Next = () => Promise<void>
type RouteMethod = 'DELETE' | 'GET' | 'HEAD' | 'POST' | 'PUT'
type ResponseBody = BodyInit | ReadableStream | null

export type Middleware = (ctx: AppContext, next: Next) => Promise<void> | void
export type ErrorHandler = (
  error: unknown,
  ctx: AppContext,
) => Promise<Response | void> | Response | void

export class AppError extends Error {
  public readonly status: number

  public constructor(status: number, message?: string) {
    super(message ?? new Response(null, { status }).statusText)
    this.name = 'AppError'
    this.status = status
  }
}

interface Route {
  method: RouteMethod
  path: string
  middlewares: Middleware[]
}

export class AppContext {
  public readonly request: Request
  public readonly env: Env
  public readonly executionContext: ExecutionContext
  public readonly url: URL
  public readonly method: string
  public readonly path: string
  public params: Record<string, string> = {}
  public readonly headers = new Headers()
  public readonly state: Record<string, unknown> = {}

  private rawBody: ResponseBody = null
  private rawResponse: Response | null = null

  public status = 404

  public constructor(request: Request, env: Env, executionContext: ExecutionContext) {
    this.request = request
    this.env = env
    this.executionContext = executionContext
    this.url = new URL(request.url)
    this.method = request.method.toUpperCase()
    this.path = this.url.pathname
  }

  public get query(): Record<string, string> {
    const params: Record<string, string> = {}
    for (const [key, value] of this.url.searchParams.entries()) {
      params[key] = value
    }
    return params
  }

  public get body() {
    return this.rawBody
  }

  public set body(value: ResponseBody) {
    this.rawBody = value
    if (value !== null && this.status === 404) {
      this.status = 200
    }
  }

  public get response() {
    return this.rawResponse
  }

  public set response(value: Response | null) {
    this.rawResponse = value
  }

  public set(name: string, value: string) {
    this.headers.set(name, value)
  }

  public throw(status: number, message?: string): never {
    throw new AppError(status, message)
  }

  public text(value: string, status = 200) {
    this.status = status
    if (!this.headers.has('Content-Type')) {
      this.headers.set('Content-Type', 'text/plain; charset=UTF-8')
    }
    this.body = value
  }

  public json(value: unknown, status = 200) {
    this.status = status
    if (!this.headers.has('Content-Type')) {
      this.headers.set('Content-Type', 'application/json; charset=UTF-8')
    }
    this.body = JSON.stringify(value)
  }

  public toResponse() {
    if (this.rawResponse) {
      return this.rawResponse
    }

    return new Response(this.rawBody as BodyInit | null, {
      status: this.status,
      headers: this.headers,
    })
  }
}

export default class App {
  private readonly request: Request
  private readonly env: Env
  private readonly executionContext: ExecutionContext
  private readonly middlewares: Middleware[] = []
  private readonly routes: Route[] = []
  private customErrorHandler: ErrorHandler | null = null

  private readonly defaultErrorHandler: ErrorHandler = (error, context) => {
    const appError = error instanceof AppError ? error : new AppError(500, 'Internal Server Error')

    // Set body first, then status to avoid the body setter changing status
    const errorBody = {
      error: {
        message: appError.message,
        status: appError.status,
      },
    }
    context.body = JSON.stringify(errorBody)
    context.status = appError.status
    if (!context.headers.has('Content-Type')) {
      context.headers.set('Content-Type', 'application/json; charset=UTF-8')
    }
  }

  public constructor(request: Request, env: Env, executionContext: ExecutionContext) {
    this.request = request
    this.env = env
    this.executionContext = executionContext
  }

  public use(middleware: Middleware) {
    this.middlewares.push(middleware)
    return this
  }

  public onError(handler: ErrorHandler) {
    this.customErrorHandler = handler
    return this
  }

  public get(path: string, ...middlewares: Middleware[]) {
    return this.addRoute('GET', path, middlewares)
  }

  public head(path: string, ...middlewares: Middleware[]) {
    return this.addRoute('HEAD', path, middlewares)
  }

  public post(path: string, ...middlewares: Middleware[]) {
    return this.addRoute('POST', path, middlewares)
  }

  public put(path: string, ...middlewares: Middleware[]) {
    return this.addRoute('PUT', path, middlewares)
  }

  public delete(path: string, ...middlewares: Middleware[]) {
    return this.addRoute('DELETE', path, middlewares)
  }

  public async start() {
    const context = new AppContext(this.request, this.env, this.executionContext)
    const route = this.matchRoute(context.method, context.path)

    if (!route) {
      const allowedMethods = this.getAllowedMethods(context.path)
      const hasPathMatch = allowedMethods.length > 0
      context.text(hasPathMatch ? 'Method Not Allowed' : 'Not Found', hasPathMatch ? 405 : 404)
      if (hasPathMatch) {
        context.set('Allow', allowedMethods.join(', '))
      }
      return this.finalizeResponse(context)
    }

    context.params = route.params

    try {
      await this.compose([...this.middlewares, ...route.route.middlewares], context)
    } catch (error) {
      const previousStatus = context.status
      const previousBody = context.body
      const previousResponse = context.response
      const previousHeaderCount = Array.from(context.headers.keys()).length

      if (this.customErrorHandler) {
        const response = await this.customErrorHandler(error, context)
        if (response) {
          context.response = response
        }
      }

      const hasCustomResult =
        context.response !== previousResponse ||
        context.body !== previousBody ||
        context.status !== previousStatus ||
        Array.from(context.headers.keys()).length !== previousHeaderCount

      if (!hasCustomResult) {
        const response = await this.defaultErrorHandler(error, context)
        if (response) {
          context.response = response
        }
      }
    }

    return this.finalizeResponse(context)
  }

  private addRoute(method: RouteMethod, path: string, middlewares: Middleware[]) {
    this.routes.push({
      method,
      path,
      middlewares,
    })
    return this
  }

  private matchRoute(method: string, path: string) {
    const methods = method === 'HEAD' ? ['HEAD', 'GET'] : [method]

    for (const route of this.routes) {
      if (!methods.includes(route.method)) {
        continue
      }

      const params = this.matchPath(route.path, path)
      if (params) {
        return {
          params,
          route,
        }
      }
    }

    return null
  }

  private getAllowedMethods(path: string) {
    const methods = new Set<RouteMethod>()

    for (const route of this.routes) {
      if (this.matchPath(route.path, path) === null) {
        continue
      }

      methods.add(route.method)
      if (route.method === 'GET') {
        methods.add('HEAD')
      }
    }

    return Array.from(methods)
  }

  private matchPath(routePath: string, actualPath: string) {
    const routeSegments = this.splitPath(routePath)
    const actualSegments = this.splitPath(actualPath)

    if (routeSegments.length !== actualSegments.length) {
      return null
    }

    const params: Record<string, string> = {}

    for (const [index, routeSegment] of routeSegments.entries()) {
      const actualSegment = actualSegments[index]
      if (!actualSegment) {
        return null
      }

      if (routeSegment.startsWith(':')) {
        params[routeSegment.slice(1)] = decodeURIComponent(actualSegment)
        continue
      }

      if (routeSegment !== actualSegment) {
        return null
      }
    }

    return params
  }

  private splitPath(path: string) {
    if (path === '/') {
      return []
    }

    return path.split('/').filter(Boolean)
  }

  private async compose(middlewares: Middleware[], context: AppContext) {
    let index = -1

    const dispatch = async (currentIndex: number): Promise<void> => {
      if (currentIndex <= index) {
        throw new Error('next() called multiple times')
      }

      index = currentIndex
      const middleware = middlewares[currentIndex]
      if (!middleware) {
        return
      }

      await middleware(context, async () => {
        await dispatch(currentIndex + 1)
      })
    }

    await dispatch(0)
  }

  private finalizeResponse(context: AppContext) {
    const response = context.toResponse()

    if (context.method !== 'HEAD') {
      return response
    }

    return new Response(null, {
      status: response.status,
      headers: response.headers,
    })
  }
}
