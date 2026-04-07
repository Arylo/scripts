import { AuthConfig } from '../../shared/types/types'

export type HonoEnv = {
  Bindings: Env
  Variables: {
    startTime: number
    sessionValue: string
    requestValue: string
    authConfig: AuthConfig
    hashedKey: string
  }
}
