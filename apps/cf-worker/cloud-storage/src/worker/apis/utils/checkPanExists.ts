import { eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { Pan } from '../../models/Pan'
import { GeneralEnv } from '../../types/hono'
import getDb from '../../utils/getDb'

async function checkPanExists(panId: string) {
  const db = getDb()
  const [pan] = await db.select().from(Pan).where(eq(Pan.id, panId)).limit(1)

  if (pan) return [true, pan] as const

  getContext<GeneralEnv>().json(
    {
      code: 404,
      message: 'Pan not found',
    },
    404,
  )

  return [false] as const
}

export default checkPanExists
