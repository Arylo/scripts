import { Hono } from 'hono'
import { adminLoginMiddleware, adminLogoutMiddleware } from '../../middlewares/adminAuth'
import { HonoEnv } from '../../types/hono'

export default {
  bind: (app: Hono<HonoEnv>) => {
    app.post('/login', adminLoginMiddleware())
    app.post('/logout', adminLogoutMiddleware())
  },
}
