import type App from '../frame/app'
import { getR2 } from '../getR2'
import getKeyWithPrefixes from '../utils/getKeyWithPrefixes'

export default function listRoute(app: InstanceType<typeof App>) {
  app.get('/', async (ctx) => {
    const r2 = getR2(ctx.env, ctx.env.R2_BUCKET)

    const [pwdToUse, prefixes] = await getKeyWithPrefixes(ctx, ctx.query.pwd)

    if (ctx.query.pwd) {
      const cookieValue = `cloud_storage_pwd=${pwdToUse}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
      ctx.set('Set-Cookie', cookieValue)
    }

    // 用所有prefixes获取R2对象列表
    const allObjects: R2Object[] = []
    for (const prefix of prefixes) {
      const r2List = await r2.list({ prefix })
      allObjects.push(...r2List.objects)
    }

    // 过滤和映射结果
    const list = allObjects
      .filter((object) => !object.key.endsWith('/'))
      .map((object) => ({
        etag: object.etag,
        key: object.key,
        size: object.size,
      }))

    ctx.json({
      code: 200,
      page: 1,
      size: list.length,
      data: list,
    })
  })
}
