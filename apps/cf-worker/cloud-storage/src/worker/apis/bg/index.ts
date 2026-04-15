import dayjs from 'dayjs'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { wrapTime } from 'hono/timing'
import { GeneralEnv } from '../../types/hono'

const MAPPING = {
  uhd: 'https://bing.img.run/uhd.php',
  m: 'https://bing.img.run/m.php',
  '768': 'https://bing.img.run/1366x768.php',
  '1080': 'https://bing.img.run/1920x1080.php',
} as const

export const route = (app: Hono<GeneralEnv>) => {
  app.get('/bg', compress({ encoding: 'gzip' }), async (c) => {
    let size = c.req.query('size') ?? 'uhd'
    if (!MAPPING.hasOwnProperty(size)) {
      size = '1080'
    }

    const expiration = dayjs().add(1, 'day').startOf('day').diff(dayjs(), 'second')
    const kvKey = `bg_${size}`
    const kv = c.env.AUTH_KV

    let contentType
    let value

    const cached = await wrapTime(
      c,
      'find cache',
      kv.getWithMetadata<{ contentType: string }>(kvKey, {
        cacheTtl: expiration,
        type: 'arrayBuffer',
      }),
    )
    if (cached.value) {
      contentType = cached.metadata?.contentType ?? 'image/jpeg'
      value = cached.value
    }

    if (!contentType || !value) {
      const rawUrl = MAPPING[size as keyof typeof MAPPING]
      const upstream = await wrapTime(c, 'fetch upstream image', fetch(rawUrl))
      if (!upstream.ok) {
        return c.redirect(rawUrl)
      }

      ;[value, contentType] = await wrapTime(
        c,
        'store cache',
        (async () => {
          contentType = upstream.headers.get('Content-Type') ?? 'image/jpeg'
          const buffer = await upstream.arrayBuffer()
          await kv.put(kvKey, buffer, {
            expirationTtl: expiration,
            metadata: { contentType },
          })
          return [buffer, contentType] as const
        })(),
      )
    }

    return new Response(value, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': `public, max-age=${expiration}`,
        'X-Cache': cached.value ? 'HIT' : 'MISS',
      },
    })
  })
}
