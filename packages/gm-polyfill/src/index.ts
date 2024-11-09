import path from 'path'
import { GM_addStyle as addStyle } from './GM_addStyle'
import { GM_info as info } from './GM_info'
import { GM as gmCollect } from './GM'

const parseModule = <F extends Function>(fn: F): F & { path: string } => {
  (fn as any).path = path.resolve(__dirname, `${fn.name}.js`)
  return fn as any
}

export const GM_addStyle = parseModule(addStyle)
export const GM_info = parseModule(info)
export const GM = parseModule(gmCollect)
