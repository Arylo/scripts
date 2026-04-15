import { Hono } from 'hono'
import { adminAuthMiddleware } from '../../middlewares/adminAuth'
import less from '../../middlewares/less'
import { AdminEnv, GeneralEnv } from '../../types/hono'
import AuthController from './auth'
import CodeController from './code'
import CodePermController from './codePerm'
import FileController from './file'
import PanController from './pan'
import PanPermController from './panPerm'

export const route = (app: Hono<GeneralEnv>) => {
  const controllers = new Hono<AdminEnv>()

  controllers.use(less(['/login'], adminAuthMiddleware()))

  AuthController.bind(controllers)
  PanController.bind(controllers)
  CodeController.bind(controllers)
  PanPermController.bind(controllers)
  CodePermController.bind(controllers)
  FileController.bind(controllers)

  app.route('/api/admin', controllers)
}
