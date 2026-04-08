# 项目结构

```
- public/ // 存放前端静态文件, 生成后会在根目录下
- src/ // 存放源码
  |- index.html // 前端入口文件
  |- shared/
  |- |- types/ // 存放共用Typescript 类型文件
  |- react-app/ // 存放前端文件, 使用React 框架
  |  |- main.tsx // React 入口文件
  |  |- Pages/ // 存放页面文件
  |  |- Components/ // 存放组件文件
  |  |- utils/ // 存放工具类文件
  |  |- hooks/ // 存放React Hook 类文件
  |  |- requests/ // 存放请求类文件
  |- worker/ // 存放Cloudflare worker 源码, 使用Hono 框架
  |  |- index.ts // Cloudflare worker 入口文件
  |  |- apis/ // 存放对外API 接口文件
  |  |- middlewares/ // 存放中间件文件
  |  |- utils/ // 存放工具类文件
  |  |- models/ // 存放数据库数据表结构文件
```
