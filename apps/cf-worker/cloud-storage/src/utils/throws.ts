import { type AppContext } from '../frame/app'

export default {
  Forbidden: (ctx: AppContext, message = 'Forbidden') => ctx.throw(403, message),
  NotFound: (ctx: AppContext, message = 'Not Found') => ctx.throw(404, message),
}
