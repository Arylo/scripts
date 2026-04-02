import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import * as filelist from './apis/filelist'
import * as filepath from './apis/filepath'
import * as filepost from './apis/filepost'
import { accessMiddleware } from './middlewares/access'
import { sessionMiddleware } from './middlewares/session'
import { startTimeMiddleware } from './middlewares/startTime'
import { HonoEnv } from './types/hono'

const app = new Hono<HonoEnv>()

app.use(contextStorage())
app.use(sessionMiddleware())
app.use(startTimeMiddleware())
app.use(accessMiddleware())

filepath.get(app)
filelist.post(app)
filepost.post(app)

export default app
