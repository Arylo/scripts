import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { PanDoc } from '../../models/PanDoc'
import { GuestEnv } from '../../types/hono'
import getDb from '../../utils/getDb'
import checkPanDocExists from '../utils/checkPanDocExists'
import getPerms from '../utils/getPerms'

export default {
  bind: (app: Hono<GuestEnv>) => {
    app.get('/raw/:file_name', async (c) => {
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

      const fileName = c.req.param('file_name')
      const db = getDb()

      const [existsPanDoc, panDoc] = await checkPanDocExists(
        panId,
        db
          .select({ data: PanDoc.docId })
          .from(PanDoc)
          .where(and(eq(PanDoc.panId, panId), eq(PanDoc.originalName, fileName))),
      )
      if (!existsPanDoc) {
        return c.json(
          {
            code: 404,
            message: 'File not found',
          },
          404,
        )
      }

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
