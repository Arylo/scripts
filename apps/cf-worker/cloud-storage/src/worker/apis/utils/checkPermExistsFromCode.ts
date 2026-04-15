import { and, eq, getTableColumns, inArray, SQLWrapper } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { CodePerm } from '../../models/CodePerm'
import { PanCode } from '../../models/PanCode'
import { Perm } from '../../models/Perm'
import { GeneralEnv } from '../../types/hono'
import getDb from '../../utils/getDb'

async function checkPermExistsFromCode(panId: string, codeId: string, permId: string | SQLWrapper) {
  const db = getDb()
  const currentPermIds = typeof permId === 'string' ? [permId] : permId
  const perms = await db
    .select(getTableColumns(Perm))
    .from(CodePerm)
    .innerJoin(Perm, eq(Perm.id, CodePerm.permId))
    .innerJoin(PanCode, eq(PanCode.codeId, CodePerm.codeId))
    .where(
      and(
        eq(CodePerm.codeId, codeId),
        inArray(CodePerm.permId, currentPermIds),
        eq(PanCode.panId, panId),
      ),
    )
    .limit(1)

  if (perms.length > 0) return [true, perms] as const

  getContext<GeneralEnv>().json(
    {
      code: 404,
      message: 'Perm not found for this Code',
    },
    404,
  )

  return [false] as const
}

export default checkPermExistsFromCode
