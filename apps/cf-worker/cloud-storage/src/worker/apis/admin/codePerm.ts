import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { CODE_PERM_TYPE } from '../../../shared/constant'
import getDb from '../../db'
import { CodePerm } from '../../models/CodePerm'
import { Perm } from '../../models/Perm'
import { HonoEnv } from '../../types/hono'
import checkCodeExists from '../utils/checkCodeExists'
import checkPermExistsFromCode from '../utils/checkPermExistsFromCode'
import checkPermType from '../utils/checkPermType'

export default {
  bind: (app: Hono<HonoEnv>) => {
    app.post('/pans/:pan_id/codes/:code_id/perms', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')
      const codeId = c.req.param('code_id')
      const { type, value } = await c.req.json()

      const [isValidType, validType] = checkPermType(type, CODE_PERM_TYPE)
      if (!isValidType) return

      const [existsCode] = await checkCodeExists(panId, codeId)
      if (!existsCode) return

      const [existsPerm] = await checkPermExistsFromCode(
        panId,
        codeId,
        db.select({ data: Perm.id }).from(Perm).where(eq(Perm.type, validType)),
      )

      if (existsPerm) {
        return c.json(
          {
            code: 400,
            message: 'Perm type already exists for this Code',
          },
          400,
        )
      }

      const [perm] = await db.insert(Perm).values({ type: validType, value }).returning()

      await db.insert(CodePerm).values({ codeId, permId: perm.id })

      return c.json({
        code: 200,
        data: { perm },
        message: 'Create Perm success',
      })
    })

    app.delete('/pans/:pan_id/codes/:code_id/perms/:perm_id', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')
      const codeId = c.req.param('code_id')
      const permId = c.req.param('perm_id')

      const [existsPerm] = await checkPermExistsFromCode(panId, codeId, permId)
      if (!existsPerm) return

      await db.delete(CodePerm).where(and(eq(CodePerm.codeId, codeId), eq(CodePerm.permId, permId)))
      await db.delete(Perm).where(eq(Perm.id, permId))

      return c.json({
        code: 200,
        message: 'Delete Perm success',
      })
    })

    app.put('/pans/:pan_id/codes/:code_id/perms/:perm_id', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')
      const codeId = c.req.param('code_id')
      const permId = c.req.param('perm_id')
      const { value } = await c.req.json()

      const [existsPerm] = await checkPermExistsFromCode(panId, codeId, permId)
      if (!existsPerm) return

      await db.update(Perm).set({ value }).where(eq(Perm.id, permId))

      return c.json({
        code: 200,
        message: 'Update Perm success',
      })
    })
  },
}
