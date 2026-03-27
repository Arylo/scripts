import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test'
import { describe, it, expect } from 'vitest'
import App from '../src/frame/app'
import routes from '../src/routes'
import { createObjectBody, createObjectMetadata, createTextStream } from './r2TestUtils'

describe('Hello World worker', () => {
  it('returns 403 when no pwd parameter or cookie is provided', async () => {
    const request = new Request('http://example.com/')
    const ctx = createExecutionContext()
    const mockEnv = {
      R2_BUCKET: 'r2',
      KV_NAMESPACE: 'kv',
      r2: {
        async list() {
          return { delimitedPrefixes: [], objects: [], truncated: false }
        },
      } as unknown as R2Bucket,
      kv: {
        async get() {
          return null
        },
      } as unknown as KVNamespace,
    }
    const response = await routes(request, mockEnv, ctx)
    await waitOnExecutionContext(ctx)
    expect(response.status).toBe(403)
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=UTF-8')
    expect(response.headers.get('X-Powered-By')).toBe('cf-worker-app')
    expect(await response.json()).toEqual({
      error: {
        message: 'Forbidden',
        status: 403,
      },
    })
  })

  it('returns 404 when KV does not contain the hash', async () => {
    const request = new Request('http://example.com/?pwd=unknownpassword')
    const ctx = createExecutionContext()
    const mockEnv = {
      R2_BUCKET: 'r2',
      KV_NAMESPACE: 'kv',
      r2: {
        async list() {
          return { delimitedPrefixes: [], objects: [], truncated: false }
        },
      } as unknown as R2Bucket,
      kv: {
        async get() {
          return null // KV中没有找到
        },
      } as unknown as KVNamespace,
    }
    const response = await routes(request, mockEnv, ctx)
    await waitOnExecutionContext(ctx)
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: {
        message: 'Not Found',
        status: 404,
      },
    })
  })

  it('returns 403 when KV value cannot be parsed as JSON', async () => {
    const request = new Request('http://example.com/?pwd=badjson')
    const ctx = createExecutionContext()
    const mockEnv = {
      R2_BUCKET: 'r2',
      KV_NAMESPACE: 'kv',
      r2: {
        async list() {
          return { delimitedPrefixes: [], objects: [], truncated: false }
        },
      } as unknown as R2Bucket,
      kv: {
        async get(key: string) {
          // For badjson test, return invalid JSON for any key
          if (key === 'C57B80A96CCAF8C616298D1297BDD2C4') {
            return 'invalid json' // 不是有效的JSON
          }
          return null
        },
      } as unknown as KVNamespace,
    }
    const response = await routes(request, mockEnv, ctx)
    await waitOnExecutionContext(ctx)
    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({
      error: {
        message: 'Forbidden',
        status: 403,
      },
    })
  })

  it('supports pwd parameter with MD5 hash and KV lookup', async () => {
    const request = new Request('http://example.com/?pwd=testpassword')
    const ctx = createExecutionContext()
    const mockEnv = {
      R2_BUCKET: 'r2',
      KV_NAMESPACE: 'kv',
      r2: {
        async list({ prefix }: { prefix?: string }) {
          if (prefix === 'prefix1/') {
            return {
              delimitedPrefixes: [],
              objects: [
                { key: 'prefix1/file1.txt', etag: 'etag1', size: 100 },
                { key: 'prefix1/file2.txt', etag: 'etag2', size: 200 },
              ],
              truncated: false,
            }
          } else if (prefix === 'prefix2/') {
            return {
              delimitedPrefixes: [],
              objects: [{ key: 'prefix2/file3.txt', etag: 'etag3', size: 300 }],
              truncated: false,
            }
          }
          return { delimitedPrefixes: [], objects: [], truncated: false }
        },
      } as unknown as R2Bucket,
      kv: {
        async get(key: string) {
          // MD5 hash of 'testpassword' is 'E16B2AB8D12314BF4EFBD6203906EA6C' (uppercase)
          if (key === 'E16B2AB8D12314BF4EFBD6203906EA6C') {
            return JSON.stringify(['prefix1/', 'prefix2/'])
          }
          return null
        },
      } as unknown as KVNamespace,
    }
    const response = await routes(request, mockEnv, ctx)
    await waitOnExecutionContext(ctx)
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=UTF-8')
    expect(response.headers.get('X-Powered-By')).toBe('cf-worker-app')
    expect(response.headers.get('Set-Cookie')).toContain('cloud_storage_pwd=testpassword')
    const result = await response.json()
    expect(result).toEqual({
      code: 200,
      page: 1,
      size: 3,
      data: [
        { etag: 'etag1', key: 'prefix1/file1.txt', size: 100 },
        { etag: 'etag2', key: 'prefix1/file2.txt', size: 200 },
        { etag: 'etag3', key: 'prefix2/file3.txt', size: 300 },
      ],
    })
  })

  it('uses pwd from cookie when no query parameter is provided', async () => {
    const request = new Request('http://example.com/', {
      headers: {
        Cookie: 'cloud_storage_pwd=testpassword',
      },
    })
    const ctx = createExecutionContext()
    const mockEnv = {
      R2_BUCKET: 'r2',
      KV_NAMESPACE: 'kv',
      r2: {
        async list({ prefix }: { prefix?: string }) {
          if (prefix === 'prefix1/') {
            return {
              delimitedPrefixes: [],
              objects: [{ key: 'prefix1/file1.txt', etag: 'etag1', size: 100 }],
              truncated: false,
            }
          } else if (prefix === 'prefix2/') {
            return {
              delimitedPrefixes: [],
              objects: [{ key: 'prefix2/file2.txt', etag: 'etag2', size: 200 }],
              truncated: false,
            }
          }
          return { delimitedPrefixes: [], objects: [], truncated: false }
        },
      } as unknown as R2Bucket,
      kv: {
        async get(key: string) {
          // MD5 hash of 'testpassword' is 'E16B2AB8D12314BF4EFBD6203906EA6C' (uppercase)
          if (key === 'E16B2AB8D12314BF4EFBD6203906EA6C') {
            return JSON.stringify(['prefix1/', 'prefix2/'])
          }
          return null
        },
      } as unknown as KVNamespace,
    }
    const response = await routes(request, mockEnv, ctx)
    await waitOnExecutionContext(ctx)
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=UTF-8')
    expect(response.headers.get('X-Powered-By')).toBe('cf-worker-app')
    // Should not set password cookie again since it already exists in request
    // But session middleware will still set session cookie
    const setCookieHeader = response.headers.get('Set-Cookie')
    expect(setCookieHeader).not.toContain('cloud_storage_pwd=testpassword')
    expect(setCookieHeader).toContain('cloud_storage_session_id=')
    const result = await response.json()
    expect(result).toEqual({
      code: 200,
      page: 1,
      size: 2,
      data: [
        { etag: 'etag1', key: 'prefix1/file1.txt', size: 100 },
        { etag: 'etag2', key: 'prefix2/file2.txt', size: 200 },
      ],
    })
  })

  it('returns 405 when the path exists but the method is not registered', async () => {
    const response = await SELF.fetch('https://example.com/', {
      method: 'POST',
    })
    expect(response.status).toBe(405)
    expect(await response.text()).toBe('Method Not Allowed')
  })

  it('supports parameterized paths like /:filepath', async () => {
    const request = new Request('http://example.com/hello.txt')
    const ctx = createExecutionContext()
    const app = new App(request, env, ctx)

    app.get('/:filepath', async (ctx) => {
      ctx.json({ filepath: ctx.params.filepath })
    })

    const response = await app.start()
    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ filepath: 'hello.txt' })
  })

  it('returns 405 for parameterized paths when only another method is registered', async () => {
    const request = new Request('http://example.com/hello.txt')
    const ctx = createExecutionContext()
    const app = new App(request, env, ctx)

    app.post('/:filepath', async () => {})

    const response = await app.start()
    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(405)
    expect(await response.text()).toBe('Method Not Allowed')
  })

  it('supports assigning a file stream to ctx.body', async () => {
    const request = new Request('http://example.com/file')
    const ctx = createExecutionContext()
    const app = new App(request, env, ctx)

    app.get('/file', async (ctx) => {
      ctx.set('Content-Type', 'text/plain; charset=UTF-8')
      ctx.body = createTextStream('file-stream')
    })

    const response = await app.start()
    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=UTF-8')
    expect(await response.text()).toBe('file-stream')
  })

  it('supports put, delete, and head routes', async () => {
    const putRequest = new Request('http://example.com/file', { method: 'PUT' })
    const putCtx = createExecutionContext()
    const putApp = new App(putRequest, env, putCtx)

    putApp.put('/file', async (ctx) => {
      ctx.text('updated')
    })

    const putResponse = await putApp.start()
    await waitOnExecutionContext(putCtx)
    expect(putResponse.status).toBe(200)
    expect(await putResponse.text()).toBe('updated')

    const deleteRequest = new Request('http://example.com/file', { method: 'DELETE' })
    const deleteCtx = createExecutionContext()
    const deleteApp = new App(deleteRequest, env, deleteCtx)

    deleteApp.delete('/file', async (ctx) => {
      ctx.text('deleted')
    })

    const deleteResponse = await deleteApp.start()
    await waitOnExecutionContext(deleteCtx)
    expect(deleteResponse.status).toBe(200)
    expect(await deleteResponse.text()).toBe('deleted')

    const headRequest = new Request('http://example.com/file', { method: 'HEAD' })
    const headCtx = createExecutionContext()
    const headApp = new App(headRequest, env, headCtx)

    headApp.get('/file', async (ctx) => {
      ctx.set('X-Route', 'get')
      ctx.text('body-should-be-stripped')
    })

    const headResponse = await headApp.start()
    await waitOnExecutionContext(headCtx)
    expect(headResponse.status).toBe(200)
    expect(headResponse.headers.get('X-Route')).toBe('get')
    expect(await headResponse.text()).toBe('')
  })

  it('returns allow header for method not allowed', async () => {
    const request = new Request('http://example.com/file', { method: 'DELETE' })
    const ctx = createExecutionContext()
    const app = new App(request, env, ctx)

    app.get('/file', async () => {})
    app.post('/file', async () => {})

    const response = await app.start()
    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(405)
    expect(response.headers.get('Allow')).toBe('GET, HEAD, POST')
  })

  it('returns unified json errors for thrown app errors', async () => {
    const request = new Request('http://example.com/file')
    const ctx = createExecutionContext()
    const app = new App(request, env, ctx)

    app.get('/file', async (ctx) => {
      ctx.throw(418, 'teapot')
    })

    const response = await app.start()
    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(418)
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=UTF-8')
    expect(await response.json()).toEqual({
      error: {
        message: 'teapot',
        status: 418,
      },
    })
  })

  it('supports overriding the default error handler', async () => {
    const request = new Request('http://example.com/file')
    const ctx = createExecutionContext()
    const app = new App(request, env, ctx)

    app.onError((error, ctx) => {
      ctx.text(error instanceof Error ? error.message : 'unknown', 500)
    })

    app.get('/file', async () => {
      throw new Error('custom-error')
    })

    const response = await app.start()
    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('custom-error')
  })

  it('returns R2 object streams with metadata and range headers', async () => {
    const request = new Request('http://example.com/file.txt', {
      headers: {
        Cookie: 'cloud_storage_pwd=testpassword',
        'If-None-Match': 'other-etag',
        Range: 'bytes=2-5',
      },
    })
    const ctx = createExecutionContext()
    const response = await routes(
      request,
      {
        R2_BUCKET: 'r2',
        KV_NAMESPACE: 'kv',
        r2: {
          async head(key: string) {
            expect(key).toBe('file.txt')
            return createObjectMetadata({ size: 11 })
          },
          async get(key: string, options?: R2GetOptions) {
            expect(key).toBe('file.txt')
            expect(options?.onlyIf).toBeInstanceOf(Headers)
            expect(options?.onlyIf instanceof Headers && options.onlyIf.get('If-None-Match')).toBe(
              'other-etag',
            )
            expect(options?.range).toEqual({ length: 4, offset: 2 })
            return createObjectBody({
              body: createTextStream('le-s'),
              range: { length: 4, offset: 2 },
              size: 11,
            })
          },
          async list() {
            return { delimitedPrefixes: [], objects: [], truncated: false }
          },
        } as unknown as R2Bucket,
        kv: {
          async get(key: string) {
            // For testpassword, return empty prefix
            return JSON.stringify([''])
          },
        } as unknown as KVNamespace,
      } as Env,
      ctx,
    )

    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(206)
    expect(response.headers.get('Accept-Ranges')).toBe('bytes')
    expect(response.headers.get('Content-Length')).toBe('4')
    expect(response.headers.get('Content-Range')).toBe('bytes 2-5/11')
    expect(response.headers.get('ETag')).toBe('"etag-value"')
    expect(response.headers.get('Last-Modified')).toBe('Mon, 23 Mar 2026 00:00:00 GMT')
    expect(await response.text()).toBe('le-s')
  })

  it('returns 412 when R2 conditional get does not include a body', async () => {
    const request = new Request('http://example.com/file.txt', {
      headers: {
        Cookie: 'cloud_storage_pwd=testpassword',
        'If-None-Match': '"etag-value"',
      },
    })
    const ctx = createExecutionContext()
    const response = await routes(
      request,
      {
        R2_BUCKET: 'r2',
        KV_NAMESPACE: 'kv',
        r2: {
          async head() {
            return createObjectMetadata()
          },
          async get() {
            return createObjectMetadata()
          },
          async list() {
            return { delimitedPrefixes: [], objects: [], truncated: false }
          },
        } as unknown as R2Bucket,
        kv: {
          async get(key: string) {
            // MD5 hash of 'testpassword' is 'E16B2AB8D12314BF4EFBD6203906EA6C'
            if (key === 'E16B2AB8D12314BF4EFBD6203906EA6C') {
              return JSON.stringify([''])
            }
            return null
          },
        } as unknown as KVNamespace,
      } as Env,
      ctx,
    )

    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(412)
    expect(response.headers.get('ETag')).toBe('"etag-value"')
    expect(response.headers.get('Content-Length')).toBe('11')
    expect(await response.text()).toBe('')
  })

  it('ignores range requests when If-Range does not match', async () => {
    const request = new Request('http://example.com/file.txt', {
      headers: {
        Cookie: 'cloud_storage_pwd=testpassword',
        'If-Range': '"other-etag"',
        Range: 'bytes=2-5',
      },
    })
    const ctx = createExecutionContext()
    const response = await routes(
      request,
      {
        R2_BUCKET: 'r2',
        KV_NAMESPACE: 'kv',
        r2: {
          async head() {
            return createObjectMetadata()
          },
          async get(_key: string, options?: R2GetOptions) {
            expect(options?.range).toBeUndefined()
            return createObjectBody()
          },
          async list() {
            return { delimitedPrefixes: [], objects: [], truncated: false }
          },
        } as unknown as R2Bucket,
        kv: {
          async get(key: string) {
            // MD5 hash of 'testpassword' is 'E16B2AB8D12314BF4EFBD6203906EA6C'
            if (key === 'E16B2AB8D12314BF4EFBD6203906EA6C') {
              return JSON.stringify([''])
            }
            return null
          },
        } as unknown as KVNamespace,
      } as Env,
      ctx,
    )

    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Range')).toBeNull()
    expect(response.headers.get('Content-Length')).toBe('11')
    expect(await response.text()).toBe('file-stream')
  })

  it('returns 416 for invalid ranges', async () => {
    const request = new Request('http://example.com/file.txt', {
      headers: {
        Cookie: 'cloud_storage_pwd=testpassword',
        Range: 'bytes=20-30',
      },
    })
    const ctx = createExecutionContext()
    const response = await routes(
      request,
      {
        R2_BUCKET: 'r2',
        KV_NAMESPACE: 'kv',
        r2: {
          async head() {
            return createObjectMetadata()
          },
          async get() {
            throw new Error('should-not-fetch-body')
          },
          async list() {
            return { delimitedPrefixes: [], objects: [], truncated: false }
          },
        } as unknown as R2Bucket,
        kv: {
          async get(key: string) {
            // MD5 hash of 'testpassword' is 'E16B2AB8D12314BF4EFBD6203906EA6C'
            if (key === 'E16B2AB8D12314BF4EFBD6203906EA6C') {
              return JSON.stringify([''])
            }
            return null
          },
        } as unknown as KVNamespace,
      } as Env,
      ctx,
    )

    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(416)
    expect(response.headers.get('Content-Range')).toBe('bytes */11')
    expect(response.headers.get('ETag')).toBe('"etag-value"')
    expect(await response.json()).toEqual({
      error: {
        message: 'Range Not Satisfiable',
        status: 416,
      },
    })
  })
})
