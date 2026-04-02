import { createMiddleware } from 'hono/factory'
import { HonoEnv } from '../types/hono'

/**
 * 生成8位大写十六进制随机值
 */
function generateRandomHex(): string {
  const array = new Uint8Array(4) // 4字节 = 32位 = 8个十六进制字符
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

export const sessionMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    // 生成session值和request值
    const sessionValue = generateRandomHex()
    const requestValue = generateRandomHex()

    // 设置到context变量中
    c.set('sessionValue', sessionValue)
    c.set('requestValue', requestValue)

    // 设置响应header
    c.header('X-Session-ID', sessionValue)
    c.header('X-Request-ID', requestValue)

    await next()
  })
