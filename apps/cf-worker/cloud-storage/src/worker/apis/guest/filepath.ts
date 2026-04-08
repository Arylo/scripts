import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import getDb from '../../db'
import { Doc } from '../../models/Doc'
import { HonoEnv } from '../../types/hono'
import checkPanDocExists from '../utils/checkPanDocExists'
import getPerms from '../utils/getPerms'

export default {
  bind: (app: Hono<HonoEnv>) => {
    app.get('/raw/:file_hash', async (c) => {
      const panId = c.get('panId')
      const codeId = c.get('codeId')

      const [{ canDownload }] = await getPerms(panId, codeId)
      if (!canDownload) {
        return c.json(
          {
            code: 403,
            message: 'No permission',
          },
          403,
        )
      }

      const fileHash = c.req.param('file_hash')
      const db = getDb()

      const [existsPanDoc, panDoc] = await checkPanDocExists(
        panId,
        db.select({ data: Doc.id }).from(Doc).where(eq(Doc.hash, fileHash)),
      )
      if (!existsPanDoc) return

      const object = await c.env.STORAGE_BUCKET.get(panDoc.doc.hash)

      if (!object) {
        return c.json(
          {
            code: 404,
            message: 'File not found in storage',
          },
          404,
        )
      }

      const headers = new Headers()
      object.writeHttpMetadata(headers)
      headers.set('etag', object.httpEtag)
      headers.set(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(panDoc.originalName)}"`,
      )

      return new Response(object.body, { headers })
    })
  },
}
