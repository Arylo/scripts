import { and, eq, getTableColumns, inArray, SQLWrapper } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import getDb from '../../db'
import { PanPerm } from '../../models/PanPerm'
import { Perm } from '../../models/Perm'
import { HonoEnv } from '../../types/hono'

async function checkPermExistsFromPan(panId: string, permId: string | SQLWrapper) {
  const db = getDb()
  const currentPermIds = typeof permId === 'string' ? [permId] : permId
  const perms = await db
    .select(getTableColumns(Perm))
    .from(PanPerm)
    .innerJoin(Perm, eq(Perm.id, PanPerm.permId))
    .where(and(eq(PanPerm.panId, panId), inArray(PanPerm.permId, currentPermIds)))
    .limit(1)

  if (perms.length > 0) return [true, perms] as const

  getContext<HonoEnv>().json(
    {
      code: 404,
      message: 'Perm not found for this Pan',
    },
    404,
  )

  return [false] as const
}

export default checkPermExistsFromPan
