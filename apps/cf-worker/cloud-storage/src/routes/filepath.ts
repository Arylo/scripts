import type App from '../frame/app'
import { getR2 } from '../getR2'
import {
  setObjectMetadataHeaders,
  matchesIfRange,
  parseRangeHeader,
  createConditionalHeaders,
  applyObjectHeaders,
} from './utils/utils'

export default function filepathRoute(app: InstanceType<typeof App>) {
  app.get('/:filepath', async (ctx) => {
    const r2 = getR2(ctx.env, ctx.env.R2_BUCKET)
    const metadata = await r2.head(ctx.params.filepath)
    if (!metadata) {
      ctx.text('Not Found', 404)
      return
    }

    const rangeHeader = ctx.request.headers.get('Range')
    const ifRange = ctx.request.headers.get('If-Range')
    let range: R2Range | undefined

    if (rangeHeader && matchesIfRange(ifRange, metadata)) {
      try {
        range = parseRangeHeader(rangeHeader, metadata.size)
      } catch {
        setObjectMetadataHeaders(ctx.headers, metadata)
        ctx.set('Content-Range', `bytes */${metadata.size}`)
        ctx.throw(416, 'Range Not Satisfiable')
      }
    }

    const object = await r2.get(ctx.params.filepath, {
      onlyIf: createConditionalHeaders(ctx.request.headers),
      range,
    })
    if (!object) {
      ctx.text('Not Found', 404)
      return
    }

    ctx.status = applyObjectHeaders(ctx.headers, object)

    if (!('body' in object)) {
      ctx.status = 412
      return
    }

    ctx.body = object.body
  })
}
