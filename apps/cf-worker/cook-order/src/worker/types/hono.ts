import { Context } from 'hono'

export type GeneralEnv<V extends Record<string, unknown> = {}> = {
  Bindings: Env
  Variables: {
    startTime: number
    sessionValue: string
    requestValue: string
  } & V
}
export type GuestEnv = GeneralEnv<{}>
export type AdminEnv = GeneralEnv<{}>

export type GeneralContext = Context<GeneralEnv>
export type GuestContext = Context<GuestEnv>
export type AdminContext = Context<AdminEnv>
