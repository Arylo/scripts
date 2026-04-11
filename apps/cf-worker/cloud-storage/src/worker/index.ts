import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { timing } from 'hono/timing'
import yn from 'yn'
import * as admin from './apis/admin'
import * as bg from './apis/bg'
import * as guest from './apis/guest'
import { accessMiddleware } from './middlewares/access'
import { sessionMiddleware } from './middlewares/session'
import { startTimeMiddleware } from './middlewares/startTime'
import { GeneralContext, GeneralEnv } from './types/hono'

const app = new Hono<GeneralEnv>()

app.use(contextStorage())
app.use(sessionMiddleware())
app.use(startTimeMiddleware())
app.use(accessMiddleware())
app.use(
  timing({
    enabled: (c: GeneralContext) => yn(c.env.DEBUG, { default: false }),
  }),
)

bg.route(app)
admin.route(app)
guest.route(app)

export default app
