export type Awaitable<T> = T | Promise<T>

function defaultSerializer(value: any) {
  return JSON.stringify(value)
}

function defaultDeserializer(value: string) {
  return JSON.parse(value)
}

export function resolveStorageOptions<TSerializer, TDeserializer>(
  options:
    | {
        serializer?: TSerializer
        deserializer?: TDeserializer
        useCache?: boolean
      }
    | undefined,
) {
  const {
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
    useCache = true,
  } = options || {}

  return {
    serializer,
    deserializer,
    useCache,
    cacheMap: new Map<string, string>(),
  }
}

export function getCachedValue(cacheMap: Map<string, string>, useCache: boolean, key: string) {
  return useCache ? cacheMap.get(key) : null
}

export function setCachedValue(
  cacheMap: Map<string, string>,
  useCache: boolean,
  key: string,
  value: string,
) {
  if (useCache) {
    cacheMap.set(key, value)
  }
}

export function hasStorageValue(value: string | undefined | null): value is string {
  return typeof value !== 'undefined' && value !== null
}
