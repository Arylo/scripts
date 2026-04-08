import { Hono } from 'hono'
import { adminAuthMiddleware } from '../../middlewares/adminAuth'
import less from '../../middlewares/less'
import { HonoEnv } from '../../types/hono'
import AuthController from './auth'
import CodeController from './code'
import CodePermController from './codePerm'
import FileController from './file'
import PanController from './pan'
import PanPermController from './panPerm'

export const route = (app: Hono<HonoEnv>) => {
  const controllers = new Hono<HonoEnv>()

  controllers.use(less(['/login'], adminAuthMiddleware()))

  AuthController.bind(controllers)
  PanController.bind(controllers)
  CodeController.bind(controllers)
  PanPermController.bind(controllers)
  CodePermController.bind(controllers)
  FileController.bind(controllers)

  app.route('/api/admin', controllers)
}
