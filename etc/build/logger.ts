import { AsyncLocalStorage } from 'async_hooks'

type CustomConsole = {
  log: typeof console.log,
  info: typeof console.info,
  warn: typeof console.warn,
  error: typeof console.error,
}

const storage = new AsyncLocalStorage<CustomConsole>();

export function inject<F extends (...args: any[]) => any>(name: string, cb: F) {
  return storage.run({
    log: (...args: any[]) => console.log(`[${name}]`, ...args),
    info: (...args: any[]) => console.info(`[${name}]`, ...args),
    warn: (...args: any[]) => console.warn(`[${name}]`, ...args),
    error: (...args: any[]) => console.error(`[${name}]`, ...args),
  }, cb)
}

export const logger = {
  log: (...args: any[]) => (storage.getStore()?.log ?? console.log)(...args),
  info: (...args: any[]) => (storage.getStore()?.log ?? console.info)(...args),
  warn: (...args: any[]) => (storage.getStore()?.log ?? console.warn)(...args),
  error: (...args: any[]) => (storage.getStore()?.log ?? console.error)(...args),
}

export default logger
