import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import getDb from '../../db'
import { Doc } from '../../models/Doc'
import { PanDoc } from '../../models/PanDoc'
import { HonoEnv } from '../../types/hono'
import checkPanDocExists from '../utils/checkPanDocExists'
import checkPanExists from '../utils/checkPanExists'
import { removeDocFromPan } from './pan'

export default {
  bind: (app: Hono<HonoEnv>) => {
    app.post('/pans/:pan_id/files/:file_hash/:file_name', async (c) => {
      const panId = c.req.param('pan_id')
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

    app.delete('/pans/:pan_id/files/:file_hash', async (c) => {
      const panId = c.req.param('pan_id')
      const fileHash = c.req.param('file_hash')

      const db = getDb()

      const [existsPanDoc, panDoc] = await checkPanDocExists(
        panId,
        db.select({ data: Doc.id }).from(Doc).where(eq(Doc.hash, fileHash)),
      )
      if (!existsPanDoc) return

      await removeDocFromPan(panDoc.panId, panDoc.docId)

      return c.json({
        code: 200,
        message: 'Remove File from Pan success',
      })
    })

    app.get('/pans/:pan_id/files/:file_hash', async (c) => {
      const panId = c.req.param('pan_id')
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

    app.put('/pans/:pan_id/files/:file_hash', async (c) => {
      const panId = c.req.param('pan_id')
      const fileHash = c.req.param('file_hash')
      const { originalName, highlight } = await c.req.json()

      const db = getDb()

      const [existsPanDoc, panDoc] = await checkPanDocExists(
        panId,
        db.select({ data: Doc.id }).from(Doc).where(eq(Doc.hash, fileHash)),
      )
      if (!existsPanDoc) return

      await db.update(PanDoc).set({ originalName, highlight }).where(eq(PanDoc.id, panDoc.id))

      return c.json({
        code: 200,
        message: 'Update File success',
      })
    })

    app.post('/pans/:pan_id/files', async (c) => {
      const panId = c.req.param('pan_id')

      const db = getDb()
      const [existsPan] = await checkPanExists(panId)
      if (!existsPan) return

      const formData = await c.req.formData()
      const file = formData.get('file') as File
      if (!file) {
        return c.json(
          {
            code: 400,
            message: 'No file uploaded',
          },
          400,
        )
      }

      const arrayBuffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('MD5', arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const fileHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

      await c.env.STORAGE_BUCKET.put(fileHash, file.stream())
      const [doc] = await db
        .insert(Doc)
        .values({
          hash: fileHash,
          mimetype: file.type,
          size: file.size,
        })
        .returning()
      await db.insert(PanDoc).values({
        panId,
        docId: doc.id,
        originalName: file.name,
      })

      return c.json({
        code: 200,
        data: {
          hash: fileHash,
          filename: file.name,
          mimetype: file.type,
          size: file.size,
        },
        message: 'File uploaded successfully',
      })
    })
  },
}
