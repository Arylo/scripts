import { Context, Hono } from 'hono'
import { getContext } from 'hono/context-storage'
import { FileInfo } from '../../shared/types/types'
import { loginMiddleware } from '../middlewares/auth'
import { HonoEnv } from '../types/hono'

async function listFilesFromR2(prefix: string): Promise<FileInfo[]> {
  const env = getContext<HonoEnv>().env
  const allFiles: FileInfo[] = []
  const authConfig = getContext<HonoEnv>().get('authConfig')
  const hashedKey = getContext<HonoEnv>().get('hashedKey')

  try {
    let cursor: string | undefined = undefined
    let hasMore = true

    // 循环获取所有文件，直到没有更多数据
    while (hasMore) {
      const listResult = await env.STORAGE_BUCKET.list({
        prefix,
        cursor,
        include: ['httpMetadata', 'customMetadata'],
      })

      for (const object of listResult.objects) {
        allFiles.push({
          size: object.size,
          key: object.key,
          name: object.customMetadata?.originalName!,
          mime: object.httpMetadata?.contentType!,
          createdAt: Number(object.customMetadata?.createdAt!),
          updatedAt: Number(object.customMetadata?.updatedAt!),
          displayName: authConfig.actives.find((item) => `${hashedKey}/${item.name}` === object.key)
            ?.displayName,
        })
      }

      // 检查是否还有更多数据
      if (listResult.truncated) {
        cursor = listResult.cursor
      } else {
        hasMore = false
      }
    }
  } catch (error) {
    console.error(`Error listing files with prefix ${prefix}:`, error)
  }

  return allFiles
}

export const post = (app: Hono<HonoEnv>) => {
  app.post('/api/files/list', loginMiddleware(), async (c: Context<HonoEnv>) => {
    try {
      const hashedKey = c.get('hashedKey')

      const prefix = `${hashedKey}/`
      const files = await listFilesFromR2(prefix)

      return c.json({
        code: 200,
        size: files.length,
        data: files,
      })
    } catch (error) {
      console.error('Error in loginAndGetFiles:', error)
      return c.json({ code: 500, error: 'Failed to process request' }, 500)
    }
  })
}
