import { and, eq, getTableColumns } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { Code } from '../../models/Code'
import { PanCode } from '../../models/PanCode'
import { GeneralEnv } from '../../types/hono'
import getDb from '../../utils/getDb'

async function checkCodeExists(panId: string, codeId: string) {
  const db = getDb()
  const [code] = await db
    .select(getTableColumns(Code))
    .from(PanCode)
    .innerJoin(Code, eq(Code.id, PanCode.codeId))
    .where(and(eq(PanCode.panId, panId), eq(PanCode.codeId, codeId)))
    .limit(1)

  if (code) return [true, code] as const

  getContext<GeneralEnv>().json(
    {
      code: 404,
      message: 'Code not found',
    },
    404,
  )

  return [false] as const
}

export default checkCodeExists
