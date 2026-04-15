import { Hono } from 'hono'
import less from '../../middlewares/less'
import { panAuthMiddleware } from '../../middlewares/panAuth'
import { GeneralEnv, GuestEnv } from '../../types/hono'
import filelist from './filelist'
import filepath from './filepath'
import filepost from './filepost'

export const route = (app: Hono<GeneralEnv>) => {
  const controllers = new Hono<GuestEnv>()

  controllers.use(less('/list', panAuthMiddleware()))

  filelist.bind(controllers)
  filepath.bind(controllers)
  filepost.bind(controllers)

  app.route('/api', controllers)
}
