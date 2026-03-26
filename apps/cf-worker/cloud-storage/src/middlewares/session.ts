import { type AppContext } from '../frame/app'
import parseCookies from '../utils/parseCookies'

function generateHexId(): string {
  const array = new Uint8Array(4) // 4 bytes = 8 hex characters
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
    .join('')
}

const SESSION_COOKIE_NAME = 'cloud_storage_session_id'
const SESSION_ID_HEADER = 'X-Session-Id'
const REQUEST_ID_HEADER = 'X-Request-Id'

export default function sessionMiddleware() {
  return async (ctx: AppContext, next: () => Promise<void>) => {
    const cookies = parseCookies(ctx.request.headers.get('Cookie'))
    let sessionId = cookies[SESSION_COOKIE_NAME]
    const isNewSession = !sessionId

    if (isNewSession) {
      sessionId = generateHexId()
    }

    const requestId = generateHexId()

    ctx.state.sessionId = sessionId
    ctx.state.requestId = requestId
    ctx.state.startDate = Date.now()

    ctx.set(SESSION_ID_HEADER, sessionId)
    ctx.set(REQUEST_ID_HEADER, requestId)

    if (isNewSession) {
      const existingHeaders = ctx.headers.get('Set-Cookie') || ''
      const sessionCookie = `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly`
      ctx.set(
        'Set-Cookie',
        existingHeaders ? `${existingHeaders}, ${sessionCookie}` : sessionCookie,
      )
    }

    await next()
  }
}
