import { eq, getTableColumns } from 'drizzle-orm'
import { Hono } from 'hono'
import getDb from '../../db'
import { panAuthMiddleware, panPickMiddleware } from '../../middlewares/panAuth'
import { Doc } from '../../models/Doc'
import { PanDoc } from '../../models/PanDoc'
import { HonoEnv } from '../../types/hono'
import getPerms from '../utils/getPerms'

export default {
  bind: (app: Hono<HonoEnv>) => {
    app.get('/list', async (c) => {
      const code = c.req.query('code')
      if (code) {
        await panPickMiddleware()(c, () => Promise.resolve())
      } else {
        await panAuthMiddleware()(c, () => Promise.resolve())
      }
      const panId = c.get('panId')
      const codeId = c.get('codeId')
      if (!panId || !codeId) return

      const db = getDb()

      const [{ canDownload, canUpload }] = await getPerms(panId, codeId)

      const list = await db
        .select({
          ...getTableColumns(Doc),
          originalName: PanDoc.originalName,
          highlight: PanDoc.highlight,
        })
        .from(PanDoc)
        .innerJoin(Doc, eq(PanDoc.docId, Doc.id))
        .where(eq(PanDoc.panId, panId))

      return c.json({
        code: 200,
        perms: {
          canDownload,
          canUpload,
        },
        data: list,
        total: list.length,
      })
    })
  },
}
