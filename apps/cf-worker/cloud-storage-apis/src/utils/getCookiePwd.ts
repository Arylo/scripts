import { AppContext } from '../frame/app'
import parseCookies from './parseCookies'

const COOKIE_NAME = 'cloud_storage_pwd'

export default function getCookiePwd(ctx: AppContext) {
  const cookies = parseCookies(ctx.request.headers.get('Cookie'))
  const pwdFromCookie = cookies[COOKIE_NAME]

  return pwdFromCookie || null
}
