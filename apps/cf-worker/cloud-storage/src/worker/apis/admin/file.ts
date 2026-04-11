import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { getContext } from 'hono/context-storage'
import mimeTypes from 'mime-types'
import {
  STATUS_CODE as ADMIN_STATUS_CODE,
  STATUS_MAP as ADMIN_STATUS_MAP,
} from '../../../shared/constant/admin'
import {
  STATUS_CODE as GENERAL_STATUS_CODE,
  STATUS_MAP as GENERAL_STATUS_MAP,
} from '../../../shared/constant/general'
import { Doc } from '../../models/Doc'
import { PanDoc } from '../../models/PanDoc'
import { AdminEnv, GeneralEnv } from '../../types/hono'
import getDb from '../../utils/getDb'
import publishJson from '../../utils/publishJson'
import checkPanDocExists from '../utils/checkPanDocExists'
import checkPanExists from '../utils/checkPanExists'
import { removeDocFromPan } from './pan'

export async function updateFileById(
  panId: string,
  doc: { id: string; mimetype: string; size: number },
  fileName: string,
  fileHash: string,
) {
  const db = getDb()

  const [existsPanDoc] = await checkPanDocExists(panId, doc.id)
  if (existsPanDoc) {
    // 情况二：Doc 已存在且与 Pan 已关联，更新 originalName
    await db
      .update(PanDoc)
      .set({ originalName: fileName })
      .where(and(eq(PanDoc.panId, panId), eq(PanDoc.docId, doc.id)))
  } else {
    // 情况一：Doc 已存在但与 Pan 无关联，插入 PanDoc
    await db.insert(PanDoc).values({ panId, docId: doc.id, originalName: fileName })
  }
  return publishJson({
    code: GENERAL_STATUS_CODE.FILE_LINK_SUCCESS,
    message: GENERAL_STATUS_MAP[GENERAL_STATUS_CODE.FILE_LINK_SUCCESS],
    data: {
      hash: fileHash,
      filename: fileName,
      mimetype: doc.mimetype,
      size: doc.size,
    },
  })
}

export async function postFileToPanByPanId(panId: string) {
  const c = getContext<GeneralEnv>()

  const db = getDb()

  const formData = await c.req.formData()
  const file = formData.get('file') as File
  if (!file) {
    return publishJson({
      code: GENERAL_STATUS_CODE.FORMDATA_NO_FILE,
      message: GENERAL_STATUS_MAP[GENERAL_STATUS_CODE.FORMDATA_NO_FILE],
    })
  }

  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('MD5', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const fileHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  let [doc] = await db.select().from(Doc).where(eq(Doc.hash, fileHash)).limit(1)

  if (doc) {
    return updateFileById(panId, doc, file.name, fileHash)
  } else {
    // 情况三：Doc 不存在，保持现有逻辑
    await c.env.STORAGE_BUCKET.put(fileHash, file.stream())
    ;[doc] = await db
      .insert(Doc)
      .values({
        hash: fileHash,
        mimetype: mimeTypes.lookup(file.name) || 'application/octet-stream',
        size: file.size,
      })
      .returning()
    await db.insert(PanDoc).values({
      panId,
      docId: doc.id,
      originalName: file.name,
    })
  }

  return publishJson({
    code: GENERAL_STATUS_CODE.FILE_UPLOAD_SUCCESS,
    message: GENERAL_STATUS_MAP[GENERAL_STATUS_CODE.FILE_UPLOAD_SUCCESS],
    data: {
      hash: fileHash,
      filename: file.name,
      mimetype: doc.mimetype,
      size: doc.size,
    },
  })
}

export default {
  bind: (app: Hono<AdminEnv>) => {
    app.post('/pans/:pan_id/files/:file_hash/:file_name', async (c) => {
      const panId = c.req.param('pan_id')
      const fileHash = c.req.param('file_hash')
      const fileName = c.req.param('file_name')

      const db = getDb()
      const [doc] = await db.select().from(Doc).where(eq(Doc.hash, fileHash)).limit(1)
      if (!doc) {
        return publishJson({
          code: GENERAL_STATUS_CODE.NON_FOUND_FILE,
          message: GENERAL_STATUS_MAP[GENERAL_STATUS_CODE.NON_FOUND_FILE],
        })
      }
      return updateFileById(panId, doc, fileName, fileHash)
    })

    app.delete('/pans/:pan_id/files/:file_hash', async (c) => {
      const panId = c.req.param('pan_id')
      const fileHash = c.req.param('file_hash')

      const db = getDb()

      const [existsPanDoc, panDoc] = await checkPanDocExists(
        panId,
        db.select({ data: Doc.id }).from(Doc).where(eq(Doc.hash, fileHash)),
      )
      if (!existsPanDoc) {
        return publishJson({
          code: GENERAL_STATUS_CODE.NON_FOUND_FILE,
          message: GENERAL_STATUS_MAP[GENERAL_STATUS_CODE.NON_FOUND_FILE],
        })
      }

      await removeDocFromPan(panDoc.panId, panDoc.docId)

      return publishJson({
        code: GENERAL_STATUS_CODE.FILE_REMOVE_SUCCESS,
        message: GENERAL_STATUS_MAP[GENERAL_STATUS_CODE.FILE_REMOVE_SUCCESS],
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
      if (!existsPanDoc) {
        return publishJson({
          code: GENERAL_STATUS_CODE.NON_FOUND_FILE,
          message: GENERAL_STATUS_MAP[GENERAL_STATUS_CODE.NON_FOUND_FILE],
        })
      }

      const object = await c.env.STORAGE_BUCKET.get(panDoc.doc.hash)

      if (!object) {
        return publishJson({
          code: GENERAL_STATUS_CODE.NON_FOUND_FILE_IN_STORAGE,
          message: GENERAL_STATUS_MAP[GENERAL_STATUS_CODE.NON_FOUND_FILE_IN_STORAGE],
        })
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
      if (!existsPanDoc) {
        return publishJson({
          code: GENERAL_STATUS_CODE.NON_FOUND_FILE,
          message: GENERAL_STATUS_MAP[GENERAL_STATUS_CODE.NON_FOUND_FILE],
        })
      }

      await db.update(PanDoc).set({ originalName, highlight }).where(eq(PanDoc.id, panDoc.id))

      return publishJson({
        code: ADMIN_STATUS_CODE.FILE_UPDATE_SUCCESS,
        message: ADMIN_STATUS_MAP[ADMIN_STATUS_CODE.FILE_UPDATE_SUCCESS],
      })
    })

    app.post('/pans/:pan_id/files', async (c) => {
      const panId = c.req.param('pan_id')

      const [existsPan] = await checkPanExists(panId)
      if (!existsPan) return

      return postFileToPanByPanId(panId)
    })
  },
}
