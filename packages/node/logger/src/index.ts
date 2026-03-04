import { AsyncLocalStorage } from 'async_hooks'
import { headParams } from '@scripts/function-control'
import lodash from 'lodash'

type CustomConsole = {
  log: typeof console.log
  debug: typeof console.log
  info: typeof console.info
  warn: typeof console.warn
  error: typeof console.error
}

const storage = new AsyncLocalStorage<CustomConsole>()

function inject<F extends (...args: any[]) => any>(names: string | string[], cb: F) {
  const flag = lodash
    .castArray(names)
    .map((name) => `[${name}]`)
    .join('')
  return storage.run(
    {
      log: headParams(console.log, flag),
      debug: headParams(console.log, flag),
      info: headParams(console.info, flag),
      warn: headParams(console.warn, flag),
      error: headParams(console.error, flag),
    },
    cb,
  )
}

export const logger = {
  log: (...args: any[]) => (storage.getStore()?.log ?? console.log)(...args),
  debug: (...args: any[]) => (storage.getStore()?.debug ?? console.log)(...args),
  info: (...args: any[]) => (storage.getStore()?.info ?? console.info)(...args),
  warn: (...args: any[]) => (storage.getStore()?.warn ?? console.warn)(...args),
  error: (...args: any[]) => (storage.getStore()?.error ?? console.error)(...args),
  inject,
}

export default logger
