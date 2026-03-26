export function getR2(env: Env, name: string) {
  const r2 = (env as any)[name] as R2Bucket
  if (!r2) {
    throw new Error('R2 binding not found')
  }
  return r2
}
