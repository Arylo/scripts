import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { PAN_PERM_TYPE } from '../../../shared/constant'
import getDb from '../../db'
import { PanPerm } from '../../models/PanPerm'
import { Perm } from '../../models/Perm'
import { HonoEnv } from '../../types/hono'
import checkPanExists from '../utils/checkPanExists'
import checkPermExistsFromPan from '../utils/checkPermExistsFromPan'
import checkPermType from '../utils/checkPermType'

export default {
  bind: (app: Hono<HonoEnv>) => {
    app.post('/pans/:pan_id/perms', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')
      const { type, value } = await c.req.json()

      const [isValidType, validType] = checkPermType(type, PAN_PERM_TYPE)
      if (!isValidType) return

      const [existsPan] = await checkPanExists(panId)
      if (!existsPan) return

      const [existsPerm] = await checkPermExistsFromPan(
        panId,
        db.select({ data: Perm.id }).from(Perm).where(eq(Perm.type, validType)),
      )

      if (existsPerm) {
        return c.json(
          {
            code: 400,
            message: 'Perm type already exists for this Pan',
          },
          400,
        )
      }

      const [perm] = await db.insert(Perm).values({ type: validType, value }).returning()

      await db.insert(PanPerm).values({ panId, permId: perm.id })

      return c.json({
        code: 200,
        data: { perm },
        message: 'Create Perm success',
      })
    })

    app.delete('/pans/:pan_id/perms/:perm_id', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')
      const permId = c.req.param('perm_id')

      const [existsPerm] = await checkPermExistsFromPan(panId, permId)
      if (!existsPerm) return

      await db.delete(PanPerm).where(and(eq(PanPerm.panId, panId), eq(PanPerm.permId, permId)))
      await db.delete(Perm).where(eq(Perm.id, permId))

      return c.json({
        code: 200,
        message: 'Delete Perm success',
      })
    })

    app.put('/pans/:pan_id/perms/:perm_id', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')
      const permId = c.req.param('perm_id')
      const { value } = await c.req.json()

      const [existsPerm] = await checkPermExistsFromPan(panId, permId)
      if (!existsPerm) return

      await db.update(Perm).set({ value }).where(eq(Perm.id, permId))

      return c.json({
        code: 200,
        message: 'Update Perm success',
      })
    })
  },
}
