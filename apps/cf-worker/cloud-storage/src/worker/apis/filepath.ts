import { Context, Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth'
import { HonoEnv } from '../types/hono'

export const get = (app: Hono<HonoEnv>) => {
  app.get(
    '/api/files/file/:filepath',
    authMiddleware(),
    async (
      c: Context<
        HonoEnv & {
          Params: { filepath: string }
        }
      >,
    ) => {
      try {
        const hashedKey = c.get('hashedKey')
        const filepath = c.req.param('filepath')

        const storageKey = `${hashedKey}/${filepath}`
        const object = await c.env.STORAGE_BUCKET.get(storageKey)

        if (!object) {
          return c.json({ code: 404, error: 'File not found in storage' }, 404)
        }

        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)

        return new Response(object.body, { headers })
      } catch (error) {
        console.error('Error in getFile:', error)
        return c.json({ code: 500, error: 'Failed to retrieve file' }, 500)
      }
    },
  )
}
