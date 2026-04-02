import { getContext } from 'hono/context-storage'
import { HonoEnv } from '../types/hono'

const getPrefix = () => {
  const sessionValue = getContext<HonoEnv>().var.sessionValue
  const requestValue = getContext<HonoEnv>().var.requestValue
  const startTime = getContext<HonoEnv>().var.startTime

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
