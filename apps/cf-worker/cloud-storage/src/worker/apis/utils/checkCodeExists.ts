import { and, eq, getTableColumns } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import getDb from '../../db'
import { Code } from '../../models/Code'
import { PanCode } from '../../models/PanCode'
import { HonoEnv } from '../../types/hono'

async function checkCodeExists(panId: string, codeId: string) {
  const db = getDb()
  const [code] = await db
    .select(getTableColumns(Code))
    .from(PanCode)
    .innerJoin(Code, eq(Code.id, PanCode.codeId))
    .where(and(eq(PanCode.panId, panId), eq(PanCode.codeId, codeId)))
    .limit(1)

  if (code) return [true, code] as const

  getContext<HonoEnv>().json(
    {
      code: 404,
      message: 'Code not found',
    },
    404,
  )

  return [false] as const
}

export default checkCodeExists
