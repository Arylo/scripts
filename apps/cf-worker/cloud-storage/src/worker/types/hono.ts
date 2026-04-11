import { Context } from 'hono'

export type GeneralEnv<V extends Record<string, unknown> = {}> = {
  Bindings: Env
  Variables: {
    startTime: number
    sessionValue: string
    requestValue: string
    panId: string
    codeId: string
  } & V
}
export type GuestEnv = GeneralEnv<{
  sharedToken: string
}>
export type AdminEnv = GeneralEnv<{
  userToken: string
}>

export type GeneralContext = Context<GeneralEnv>
export type GuestContext = Context<GuestEnv>
export type AdminContext = Context<AdminEnv>
