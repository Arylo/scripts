import { Context, Hono } from 'hono'
import * as mime from 'mime-types'
import { authMiddleware } from '../middlewares/auth'
import { HonoEnv } from '../types/hono'

export const post = (app: Hono<HonoEnv>) => {
  app.post('/api/files/file', authMiddleware(), async (c: Context<HonoEnv>) => {
    try {
      const hashedKey = c.get('hashedKey')
      const formData = await c.req.formData()
      const file = formData.get('file') as File

      if (!file) {
        return c.json({ code: 400, error: 'Missing file' }, 400)
      }

      const originalName = file.name

      const contentType = mime.lookup(originalName) || 'application/octet-stream'

      const storageKey = `${hashedKey}/${originalName}`

      const arrayBuffer = await file.arrayBuffer()

      await c.env.STORAGE_BUCKET.put(storageKey, arrayBuffer, {
        httpMetadata: {
          contentType,
        },
        customMetadata: {
          originalName,
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
        },
      })

      return c.json({
        code: 200,
        message: 'File uploaded successfully',
        data: {
          key: storageKey,
          originalName,
          contentType,
          size: file.size,
        },
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      return c.json({ code: 500, error: 'Failed to upload file' }, 500)
    }
  })
}
