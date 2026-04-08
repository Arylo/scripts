export type HonoEnv = {
  Bindings: Env
  Variables: {
    startTime: number
    sessionValue: string
    requestValue: string
    userToken: string
    sharedToken: string
    panId: string
    codeId: string
  }
}
