import { Hono } from 'hono'
import { adminLoginMiddleware, adminLogoutMiddleware } from '../../middlewares/adminAuth'
import { AdminEnv } from '../../types/hono'

export default {
  bind: (app: Hono<AdminEnv>) => {
    app.post('/login', adminLoginMiddleware())
    app.post('/logout', adminLogoutMiddleware())
  },
}
