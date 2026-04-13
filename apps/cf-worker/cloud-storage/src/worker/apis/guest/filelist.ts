import { eq, getTableColumns } from 'drizzle-orm'
import { Hono } from 'hono'
import { panAuthMiddleware, panPickMiddleware } from '../../middlewares/panAuth'
import { Doc } from '../../models/Doc'
import { PanDoc } from '../../models/PanDoc'
import { GuestEnv } from '../../types/hono'
import getDb from '../../utils/getDb'
import getPerms from '../utils/getPerms'

export default {
  bind: (app: Hono<GuestEnv>) => {
    app.get('/list', async (c) => {
      const code = c.req.query('code')
      if (code) {
        const result = await panPickMiddleware()(c, () => Promise.resolve())
        if (result) return result
      } else {
        const result = await panAuthMiddleware()(c, () => Promise.resolve())
        if (result) return result
      }
      const panId = c.get('panId')
      const codeId = c.get('codeId')

      const db = getDb()

      const [{ canDownload, canUpload, canDelete }] = await getPerms(panId, codeId)

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
          canDelete,
        },
        data: list,
        total: list.length,
      })
    })
  },
}
