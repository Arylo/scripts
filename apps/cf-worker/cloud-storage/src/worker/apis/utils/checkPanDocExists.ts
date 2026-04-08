import { and, eq, getTableColumns, inArray, SQLWrapper } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import getDb from '../../db'
import { Doc } from '../../models/Doc'
import { PanDoc } from '../../models/PanDoc'
import { HonoEnv } from '../../types/hono'

async function checkPanDocExists(panId: string, docId: string | SQLWrapper) {
  const db = getDb()
  const currentDocIds = typeof docId === 'string' ? [docId] : docId
  const [panDoc] = await db
    .select({
      ...getTableColumns(PanDoc),
      doc: getTableColumns(Doc),
    })
    .from(PanDoc)
    .innerJoin(Doc, eq(Doc.id, PanDoc.docId))
    .where(and(eq(PanDoc.panId, panId), inArray(PanDoc.docId, currentDocIds)))
    .limit(1)

  if (panDoc) return [true, panDoc] as const

  getContext<HonoEnv>().json(
    {
      code: 404,
      message: 'Doc not found in this Pan',
    },
    404,
  )

  return [false] as const
}

export default checkPanDocExists
