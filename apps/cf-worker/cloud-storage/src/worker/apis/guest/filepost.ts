import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { Doc } from '../../models/Doc'
import { PanDoc } from '../../models/PanDoc'
import { GuestEnv } from '../../types/hono'
import getDb from '../../utils/getDb'
import { postFileToPanByPanId } from '../admin/file'
import checkPanDocExists from '../utils/checkPanDocExists'
import getPerms from '../utils/getPerms'

const checkUploadPerm = () =>
  createMiddleware<GuestEnv>(async (c, next) => {
    const panId = c.get('panId')
    const codeId = c.get('codeId')
    const [{ canUpload }] = await getPerms(panId, codeId)
    if (!canUpload) {
      return c.json(
        {
          code: 403,
          message: 'No permission',
        },
        403,
      )
    }
    await next()
  })

export default {
  bind: (app: Hono<GuestEnv>) => {
    app.post('/upload/:file_hash/:file_name', checkUploadPerm(), async (c) => {
      const panId = c.get('panId')
      const fileHash = c.req.param('file_hash')
      const fileName = c.req.param('file_name')

      const db = getDb()
      const [doc] = await db.select().from(Doc).where(eq(Doc.hash, fileHash)).limit(1)
      if (!doc) {
        return c.json(
          {
            code: 404,
            message: 'File not found in storage',
          },
          404,
        )
      }
      const [existsPanDoc] = await checkPanDocExists(panId, doc.id)
      if (existsPanDoc) {
        await db
          .update(PanDoc)
          .set({ originalName: fileName })
          .where(and(eq(PanDoc.panId, panId), eq(PanDoc.docId, doc.id)))
        return c.json({
          code: 200,
          message: 'File already exists in this Pan',
        })
      }
      await db.insert(PanDoc).values({ panId, docId: doc.id, originalName: fileName })
      return c.json({
        code: 200,
        message: 'File added to Pan successfully',
      })
    })
    app.post('/upload/:file_hash', checkUploadPerm(), async (c) => {
      const panId = c.get('panId')

      return postFileToPanByPanId(panId)
    })
  },
}
