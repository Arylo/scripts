import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import * as admin from './apis/admin'
import * as guest from './apis/guest'
import { accessMiddleware } from './middlewares/access'
import { sessionMiddleware } from './middlewares/session'
import { startTimeMiddleware } from './middlewares/startTime'
import { HonoEnv } from './types/hono'

const app = new Hono<HonoEnv>()

app.use(contextStorage())
app.use(sessionMiddleware())
app.use(startTimeMiddleware())
app.use(accessMiddleware())

admin.route(app)
guest.route(app)

export default app
