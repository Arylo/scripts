// 测试session中间件的简单脚本
import { Hono } from 'hono'
import { sessionMiddleware } from './src/worker/middlewares/session'

const app = new Hono()

// 应用session中间件
app.use(sessionMiddleware())

// 创建一个简单的路由来测试session值
app.get('/test-session', (c) => {
  const sessionValue = c.get('sessionValue') as string
  const requestValue = c.get('requestValue') as string

  return c.json({
    sessionValue,
    requestValue,
    headers: {
      'X-Session-ID': c.res.headers.get('X-Session-ID'),
      'X-Request-ID': c.res.headers.get('X-Request-ID'),
    },
  })
})

// 导出给测试使用
export default app
