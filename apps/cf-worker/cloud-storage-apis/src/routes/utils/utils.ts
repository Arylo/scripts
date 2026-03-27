export function setObjectMetadataHeaders(headers: Headers, object: R2Object) {
  object.writeHttpMetadata(headers)
  headers.set('Accept-Ranges', 'bytes')
  headers.set('ETag', object.httpEtag)
  headers.set('Last-Modified', object.uploaded.toUTCString())
}

export function getRangeInfo(range: R2Range | undefined, size: number) {
  if (!range) {
    return null
  }

  if ('suffix' in range) {
    const length = Math.min(range.suffix, size)
    const start = Math.max(size - length, 0)
    const end = size === 0 ? 0 : size - 1
    return { end, length, start }
  }

  const start = range.offset ?? 0
  const length = range.length ?? Math.max(size - start, 0)
  const end = length === 0 ? start : start + length - 1

  return { end, length, start }
}

export function parseRangeHeader(rangeHeader: string, size: number): R2Range {
  if (!rangeHeader.startsWith('bytes=')) {
    throw new Error('Only byte ranges are supported')
  }

  const rangeValue = rangeHeader.slice('bytes='.length).trim()
  if (!rangeValue || rangeValue.includes(',')) {
    throw new Error('Multiple ranges are not supported')
  }

  if (size <= 0) {
    throw new Error('Range is out of bounds')
  }

  if (rangeValue.startsWith('-')) {
    const suffix = Number.parseInt(rangeValue.slice(1), 10)
    if (!Number.isFinite(suffix) || suffix <= 0) {
      throw new Error('Range suffix is invalid')
    }

    return { suffix }
  }

  const [startPart, endPart] = rangeValue.split('-')
  if (!startPart || endPart === undefined) {
    throw new Error('Range format is invalid')
  }

  const start = Number.parseInt(startPart, 10)
  if (!Number.isFinite(start) || start < 0 || start >= size) {
    throw new Error('Range start is invalid')
  }

  if (endPart === '') {
    return { offset: start }
  }

  const end = Number.parseInt(endPart, 10)
  if (!Number.isFinite(end) || end < start) {
    throw new Error('Range end is invalid')
  }

  return {
    offset: start,
    length: Math.min(end, size - 1) - start + 1,
  }
}

export function matchesIfRange(ifRange: string | null, object: R2Object) {
  if (!ifRange) {
    return true
  }

  if (ifRange.startsWith('"')) {
    return ifRange === object.httpEtag
  }

  if (ifRange.startsWith('W/')) {
    return false
  }

  const timestamp = Date.parse(ifRange)
  if (Number.isNaN(timestamp)) {
    return false
  }

  return object.uploaded.getTime() <= timestamp
}

export function createConditionalHeaders(requestHeaders: Headers) {
  const headers = new Headers()
  const supportedHeaders = ['If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Unmodified-Since']

  for (const name of supportedHeaders) {
    const value = requestHeaders.get(name)
    if (value) {
      headers.set(name, value)
    }
  }

  return headers
}

export function applyObjectHeaders(headers: Headers, object: R2Object) {
  setObjectMetadataHeaders(headers, object)

  const rangeInfo = getRangeInfo(object.range, object.size)
  if (rangeInfo) {
    headers.set('Content-Length', String(rangeInfo.length))
    headers.set('Content-Range', `bytes ${rangeInfo.start}-${rangeInfo.end}/${object.size}`)
    return 206
  }

  headers.set('Content-Length', String(object.size))
  return 200
}
