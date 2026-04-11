import { and, eq, exists, getTableColumns, inArray, not, SQLWrapper } from 'drizzle-orm'
import { Hono } from 'hono'
import { getContext } from 'hono/context-storage'
import { Code } from '../../models/Code'
import { CodePerm } from '../../models/CodePerm'
import { Doc } from '../../models/Doc'
import { Pan } from '../../models/Pan'
import { PanCode } from '../../models/PanCode'
import { PanDoc } from '../../models/PanDoc'
import { PanPerm } from '../../models/PanPerm'
import { Perm } from '../../models/Perm'
import { AdminEnv } from '../../types/hono'
import getDb from '../../utils/getDb'
import checkPanExists from '../utils/checkPanExists'

export async function removeCodeFromPan(panId: string, codeIds: string[] | string | SQLWrapper) {
  const db = getDb()
  const currentCodeIds = typeof codeIds === 'string' ? [codeIds] : codeIds

  await db
    .delete(Perm)
    .where(
      inArray(
        Perm.id,
        db
          .select({ data: CodePerm.permId })
          .from(CodePerm)
          .where(inArray(CodePerm.codeId, currentCodeIds)),
      ),
    )
  const codes = await db.delete(Code).where(inArray(Code.id, currentCodeIds)).returning()

  await db.delete(CodePerm).where(
    inArray(
      CodePerm.codeId,
      codes.map((code) => code.id),
    ),
  )
  await db.delete(PanCode).where(
    and(
      eq(PanCode.panId, panId),
      inArray(
        PanCode.codeId,
        codes.map((code) => code.id),
      ),
    ),
  )
}

export async function removeDocFromPan(panId: string, docIds: string[] | string | SQLWrapper) {
  const db = getDb()
  const currentDocIds = typeof docIds === 'string' ? [docIds] : docIds

  await db.delete(PanDoc).where(and(eq(PanDoc.panId, panId), inArray(PanDoc.docId, currentDocIds)))

  // 如果Doc还和其他Pan关联，则只删除关联; 否则同时删除DocInfo和Doc
  const [hasOtherPan] = await db
    .select()
    .from(PanDoc)
    .where(and(not(eq(PanDoc.panId, panId)), inArray(PanDoc.docId, currentDocIds)))
    .limit(1)

  if (!hasOtherPan) {
    await db.delete(Doc).where(inArray(Doc.id, currentDocIds))
    const docs = await db.select({ hash: Doc.hash }).from(Doc).where(inArray(Doc.id, currentDocIds))
    for (const { hash } of docs) {
      await getContext<AdminEnv>().env.STORAGE_BUCKET.delete(hash)
    }
  }
}

export default {
  bind: (app: Hono<AdminEnv>) => {
    app.get('/pans', async (c) => {
      const db = getDb()
      const pans = await db.select().from(Pan)
      return c.json({
        code: 200,
        size: pans.length,
        data: pans,
      })
    })

    app.post('/pans', async (c) => {
      const db = getDb()
      const pan = await db.insert(Pan).values({}).returning()
      return c.json({
        code: 200,
        data: pan[0],
        message: 'Create Pan succuss',
      })
    })

    app.delete('/pans/:pan_id', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')

      const [existsPan, pan] = await checkPanExists(panId)
      if (!existsPan) return

      await removeCodeFromPan(
        pan.id,
        db.select({ codeId: PanCode.codeId }).from(PanCode).where(eq(PanCode.panId, pan.id)),
      )

      await removeDocFromPan(
        pan.id,
        db.select({ docId: PanDoc.docId }).from(PanDoc).where(eq(PanDoc.panId, pan.id)),
      )

      await db.delete(Perm).where(
        exists(
          db
            .select()
            .from(PanPerm)
            .where(and(eq(PanPerm.panId, pan.id), eq(PanPerm.permId, Perm.id))),
        ),
      )

      // 删除关联表记录（外键关系）
      await db.delete(PanPerm).where(eq(PanPerm.panId, pan.id))

      // 删除主记录
      await db.delete(Pan).where(eq(Pan.id, pan.id))

      return c.json({
        code: 200,
        message: 'Delete Pan success',
      })
    })

    app.get('/pans/:pan_id', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')

      const [existsPan, pan] = await checkPanExists(panId)
      if (!existsPan) return

      const codes = await db
        .select(getTableColumns(Code))
        .from(Code)
        .where(
          exists(
            db
              .select()
              .from(PanCode)
              .where(and(eq(PanCode.panId, panId), eq(PanCode.codeId, Code.id))),
          ),
        )

      const perms = await db
        .select()
        .from(Perm)
        .where(
          exists(
            db
              .select()
              .from(PanPerm)
              .where(and(eq(PanPerm.panId, panId), eq(PanPerm.permId, Perm.id))),
          ),
        )

      const docs = await db
        .select({
          ...getTableColumns(Doc),
          originalName: PanDoc.originalName,
          highlight: PanDoc.highlight,
        })
        .from(Doc)
        .innerJoin(PanDoc, and(eq(PanDoc.docId, Doc.id), eq(PanDoc.panId, panId)))

      return c.json({
        code: 200,
        data: {
          ...pan,
          codes,
          perms,
          docs,
        },
      })
    })

    app.put('/pans/:pan_id', async (c) => {
      const db = getDb()
      const panId = c.req.param('pan_id')

      const [existsPan] = await checkPanExists(panId)
      if (!existsPan) return

      const { active } = await c.req.json()
      await db.update(Pan).set({ active }).where(eq(Pan.id, panId))

      return c.json({
        code: 200,
        message: 'Update Pan success',
      })
    })
  },
}
