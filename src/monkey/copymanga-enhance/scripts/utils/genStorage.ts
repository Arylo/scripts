function serializer (value: any) {
  return JSON.stringify(value)
}

function deserializer (value: string) {
  return JSON.parse(value)
}

export default function genStorage <T = any>(options?: {
  save: (key: string, value: string) => any,
  load: (key: string) => string | undefined | null,
}) {
  const cacheMap = new Map<string, string>()

  function getter (key: string, defaultValue: T): T
  function getter (key: string, defaultValue?: T): T | undefined
  function getter (key: string, defaultValue?: T): T | undefined {
    const result = cacheMap.get(key) ?? options?.load(key)
    if (typeof result !== 'undefined' && result !== null) {
      return deserializer(result)
    }
    return defaultValue
  }

  return {
    get: getter,
    set (key: string, value: T) {
      const result = serializer(value)
      options?.save(key, result)
      cacheMap.set(key, result)
    },
  }
}
