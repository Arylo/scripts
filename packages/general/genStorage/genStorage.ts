import { getCachedValue, hasStorageValue, resolveStorageOptions, setCachedValue } from './shared'

export function genStorage<D = any>(options?: {
  save: (key: string, value: string) => any
  load: (key: string) => string | undefined | null
  serializer?: (value: D) => string
  deserializer?: (value: string) => D
  useCache?: boolean
}) {
  const { serializer, deserializer, useCache, cacheMap } = resolveStorageOptions(options)

  function getter(key: string, defaultValue: D): D
  function getter(key: string, defaultValue?: D): D | undefined
  function getter(key: string, defaultValue?: D): D | undefined {
    const cached = getCachedValue(cacheMap, useCache, key)
    const result = hasStorageValue(cached) ? cached : options?.load(key)
    if (hasStorageValue(result)) {
      return deserializer(result)
    }
    return defaultValue
  }

  return {
    get: getter,
    set(key: string, value: D) {
      const result = serializer(value)
      options?.save(key, result)
      setCachedValue(cacheMap, useCache, key, result)
    },
  }
}
