export function createTextStream(value: string) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(value))
      controller.close()
    },
  })
}

export function createObjectBody(overrides: Partial<R2ObjectBody> = {}): R2ObjectBody {
  const object = {
    body: createTextStream('file-stream'),
    checksums: {},
    customMetadata: {},
    etag: 'etag-value',
    httpEtag: '"etag-value"',
    key: 'file.txt',
    range: undefined,
    size: 11,
    storageClass: 'Standard',
    uploaded: new Date('2026-03-23T00:00:00.000Z'),
    version: 'v1',
    writeHttpMetadata(headers: Headers) {
      headers.set('Content-Type', 'text/plain; charset=UTF-8')
    },
    async arrayBuffer() {
      return new TextEncoder().encode('file-stream').buffer
    },
    async blob() {
      return new Blob(['file-stream'])
    },
    bodyUsed: false,
    async bytes() {
      return new TextEncoder().encode('file-stream')
    },
    async json<T>() {
      return JSON.parse('null') as T
    },
    async text() {
      return 'file-stream'
    },
    ...overrides,
  }

  return object as unknown as R2ObjectBody
}

export function createObjectMetadata(overrides: Partial<R2Object> = {}): R2Object {
  const object = {
    checksums: {},
    customMetadata: {},
    etag: 'etag-value',
    httpEtag: '"etag-value"',
    key: 'file.txt',
    range: undefined,
    size: 11,
    storageClass: 'Standard',
    uploaded: new Date('2026-03-23T00:00:00.000Z'),
    version: 'v1',
    writeHttpMetadata(headers: Headers) {
      headers.set('Content-Type', 'text/plain; charset=UTF-8')
    },
    ...overrides,
  }

  return object as unknown as R2Object
}
