import { eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import getDb from '../../db'
import { Pan } from '../../models/Pan'
import { HonoEnv } from '../../types/hono'

async function checkPanExists(panId: string) {
  const db = getDb()
  const [pan] = await db.select().from(Pan).where(eq(Pan.id, panId)).limit(1)

  if (pan) return [true, pan] as const

  getContext<HonoEnv>().json(
    {
      code: 404,
      message: 'Pan not found',
    },
    404,
  )

  return [false] as const
}

export default checkPanExists
