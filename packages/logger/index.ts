import { AsyncLocalStorage } from 'async_hooks'
import lodash from 'lodash'
import { headParams } from '../functionControl';

type CustomConsole = {
  log: typeof console.log,
  info: typeof console.info,
  warn: typeof console.warn,
  error: typeof console.error,
}

const storage = new AsyncLocalStorage<CustomConsole>();

function inject<F extends (...args: any[]) => any>(names: string | string[], cb: F) {
  const flag = lodash.castArray(names).map((name) => `[${name}]`).join('')
  return storage.run({
    log: headParams(console.log, flag),
    info: headParams(console.info, flag),
    warn: headParams(console.warn, flag),
    error: headParams(console.error, flag),
  }, cb)
}

export const logger = {
  log: (...args: any[]) => (storage.getStore()?.log ?? console.log)(...args),
  info: (...args: any[]) => (storage.getStore()?.log ?? console.info)(...args),
  warn: (...args: any[]) => (storage.getStore()?.log ?? console.warn)(...args),
  error: (...args: any[]) => (storage.getStore()?.log ?? console.error)(...args),
  inject,
}

export default logger
