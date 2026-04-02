import { AuthConfig } from '../../types/types.d'

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
