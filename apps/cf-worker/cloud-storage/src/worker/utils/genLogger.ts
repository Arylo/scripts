import { getContext } from 'hono/context-storage'
import { GeneralEnv } from '../types/hono'

const getPrefix = () => {
  const sessionValue = getContext<GeneralEnv>().var.sessionValue
  const requestValue = getContext<GeneralEnv>().var.requestValue
  const startTime = getContext<GeneralEnv>().var.startTime

  return [
    new Date().toISOString(),
    '-',
    [sessionValue, requestValue, Date.now() - startTime].map((v) => `[${v}]`).join(''),
    '-',
  ].join(' ')
}

const debug = (...args: any[]) => {
  console.debug(getPrefix(), ...args)
}

const info = (...args: any[]) => {
  console.info(getPrefix(), ...args)
}

const warn = (...args: any[]) => {
  console.warn(getPrefix(), ...args)
}

const error = (...args: any[]) => {
  console.error(getPrefix(), ...args)
}

export default function genLogger() {
  return {
    log: debug,
    debug,
    info,
    warn,
    error,
  }
}
