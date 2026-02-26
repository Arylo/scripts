import {
  getCachedValue,
  hasStorageValue,
  resolveStorageOptions,
  setCachedValue,
  type Awaitable,
} from './shared'

export function genStorageAsync <D = any>(options?: {
  save: (key: string, value: string) => Awaitable<any>,
  load: (key: string) => Awaitable<string | undefined | null>,
  serializer?: (value: D) => Awaitable<string>,
  deserializer?: (value: string) => Awaitable<D>,
  useCache?: boolean,
}) {
  const { serializer, deserializer, useCache, cacheMap } = resolveStorageOptions(options)

  function getter (key: string, defaultValue: D): Promise<D>
  function getter (key: string, defaultValue?: D): Promise<D | undefined>
  async function getter (key: string, defaultValue?: D): Promise<D | undefined> {
    const cached = getCachedValue(cacheMap, useCache, key)
    const result = hasStorageValue(cached)
      ? cached
      : await options?.load(key)

    if (hasStorageValue(result)) {
      return await deserializer(result)
    }
    return defaultValue
  }

  return {
    get: getter,
    async set (key: string, value: D) {
      const result = await serializer(value)
      await options?.save(key, result)
      setCachedValue(cacheMap, useCache, key, result)
    },
  }
}
