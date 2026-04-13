# Worker CLAUDE.md

基于 **Hono** 的 Cloudflare Worker 后端。

## 路由结构

| 前缀 | 说明 |
|------|------|
| `/api/admin/*` | 管理员接口，需要 `adminAuth` 中间件 |
| `/api/*` | 访客接口，`/api/list` 需要 `panAuth` 中间件 |
| `/bg` | 必应每日壁纸代理，结果缓存至 KV |

## 中间件（按挂载顺序）

- `session` — 从 KV 读取 session 并注入 context
- `startTime` — 记录请求起始时间
- `access` — 请求/响应日志
- `adminAuth` — 验证管理员身份（跳过 `/login`）
- `panAuth` — 验证 pan code 访问权限（跳过 `/list`）
- `less` — 条件跳过指定路由的中间件

## APIs

### Admin（`/api/admin`）
- `auth` — 登录 / 登出
- `pan` — Pan CRUD
- `code` — Code CRUD
- `panPerm` — Pan 权限管理
- `codePerm` — Code 权限管理
- `file` — 文件上传 / 删除

### Guest（`/api`）
- `filelist` — 获取 pan 文件列表
- `filepath` — 获取单个文件内容（按 hash 代理）
- `filepost` — 访客上传 / 删除文件

## Models（Drizzle ORM + D1 SQLite）

所有表主键使用 ULID，`updatedAt` / `createdAt` 自动维护。

- 主要表：`pan`、`code`、`perm`、`doc`
- 关联包表：`pan_doc`、`pan_code`、`pan_perm`、`code_perm`

## Utils

- `genLogger` — 生成带前缀的 logger 实例
- `getDb` — 获取 Drizzle D1 实例
- `publishJson` — 统一 JSON 响应包装
