export function getKV(env: Env, name: string) {
  const kv = (env as any)[name] as KVNamespace
  if (!kv) {
    throw new Error('KV binding not found')
  }
  return kv
}
