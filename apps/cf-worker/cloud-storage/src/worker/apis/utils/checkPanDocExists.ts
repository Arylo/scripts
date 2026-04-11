import { and, eq, getTableColumns, inArray, SQLWrapper } from 'drizzle-orm'
import { Doc } from '../../models/Doc'
import { PanDoc } from '../../models/PanDoc'
import getDb from '../../utils/getDb'

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

  return [false] as const
}

export default checkPanDocExists
