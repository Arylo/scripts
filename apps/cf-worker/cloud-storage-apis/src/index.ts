import routes from './routes'

export default {
  async fetch(request, env, ctx): Promise<Response> {
    return routes(request, env, ctx)
  },
} satisfies ExportedHandler<Env>
