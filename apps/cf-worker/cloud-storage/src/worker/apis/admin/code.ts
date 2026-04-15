import { and, eq, exists, getTableColumns } from 'drizzle-orm'
import { Hono } from 'hono'
import { customAlphabet } from 'nanoid'
import { Code } from '../../models/Code'
import { CodePerm } from '../../models/CodePerm'
import { PanCode } from '../../models/PanCode'
import { Perm } from '../../models/Perm'
import { AdminEnv } from '../../types/hono'
import getDb from '../../utils/getDb'
import checkCodeExists from '../utils/checkCodeExists'
import checkPanExists from '../utils/checkPanExists'
import { removeCodeFromPan } from './pan'

export const generateNewCode = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)

export default {
  bind: (app: Hono<AdminEnv>) => {
    app.get('/codes', async (c) => {
      const db = getDb()
      const codes = await db
        .select({ ...getTableColumns(Code), panId: PanCode.panId })
        .from(Code)
        .leftJoin(PanCode, eq(PanCode.codeId, Code.id))
      return c.json({
        code: 200,
        size: codes.length,
        data: codes,
      })
    })

    app.get('/pans/:pan_id/codes/:code_id', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')
      const codeId = c.req.param('code_id')

      const [existsCode, code] = await checkCodeExists(panId, codeId)
      if (!existsCode) return

      const perms = await db
        .select()
        .from(Perm)
        .where(
          exists(
            db
              .select()
              .from(CodePerm)
              .where(and(eq(CodePerm.codeId, codeId), eq(CodePerm.permId, Perm.id))),
          ),
        )

      return c.json({
        code: 200,
        data: { ...code, perms },
      })
    })

    app.post('/pans/:pan_id/codes', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')

      const [existsPan] = await checkPanExists(panId)
      if (!existsPan) return

      let code: typeof Code.$inferSelect | undefined
      for (let attempts = 0; attempts < 5; attempts++) {
        const value = generateNewCode()
        const [duplicate] = await db.select().from(Code).where(eq(Code.value, value)).limit(1)
        if (duplicate) continue
        ;[code] = await db.insert(Code).values({ value }).returning()
        break
      }
      if (!code) return c.json({ code: 500, message: 'Failed to generate unique code' }, 500)

      await db.insert(PanCode).values({ panId, codeId: code.id })

      return c.json({
        code: 200,
        data: { code },
        message: 'Create Code success',
      })
    })

    app.delete('/pans/:pan_id/codes/:code_id', async (c) => {
      const panId = c.req.param('pan_id')
      const codeId = c.req.param('code_id')

      const [existsCode] = await checkCodeExists(panId, codeId)
      if (!existsCode) return

      await removeCodeFromPan(panId, codeId)

      return c.json({
        code: 200,
        message: 'Delete Code success',
      })
    })

    app.put('/pans/:pan_id/codes/:code_id', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')
      const codeId = c.req.param('code_id')

      const [existsCode] = await checkCodeExists(panId, codeId)
      if (!existsCode) return

      const { active } = await c.req.json()

      await db.update(Code).set({ active }).where(eq(Code.id, codeId))

      return c.json({
        code: 200,
        message: 'Update Code success',
      })
    })
  },
}
