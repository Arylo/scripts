import { getContext } from 'hono/context-storage'
import { ContentfulStatusCode } from 'hono/utils/http-status'
import { ApiResponse } from '../../shared/types/types'
import { GeneralEnv } from '../types/hono'

export default function publishJson<T extends ApiResponse<unknown>>(
  data: T,
  status: ContentfulStatusCode = 200,
) {
  const c = getContext<GeneralEnv>()
  const httpStatusCode = Math.floor(data.code / 1000)
  return c.json(data, httpStatusCode === status ? status : (httpStatusCode as ContentfulStatusCode))
}
