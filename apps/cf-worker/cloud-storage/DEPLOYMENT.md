# 部署指南

## 前提条件

1. 安装 [Node.js](https://nodejs.org/) (v18 或更高版本)
2. 安装 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/):
   ```bash
   npm install -g wrangler
   ```
3. 登录 Cloudflare:
   ```bash
   npx wrangler login
   ```

## 本地开发

1. 安装依赖:
   ```bash
   npm install
   ```

2. 启动开发服务器:
   ```bash
   npm run dev
   ```

3. 在浏览器中打开: http://localhost:5173

## 配置 R2 Bucket

### 1. 创建 R2 Bucket

在 Cloudflare Dashboard 中:
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 导航到 **R2** → **Create bucket**
3. 输入 bucket 名称（例如: `cloud-storage-bucket`）
4. 点击 **Create bucket**

### 2. 更新配置文件

如果需要更改 bucket 名称，编辑 `wrangler.json`:
```json
"r2_buckets": [
  {
    "binding": "STORAGE_BUCKET",
    "bucket_name": "your-bucket-name"
  }
]
```

### 3. 生成类型定义

更新配置后，运行:
```bash
npm run cf-typegen
# 或
npx wrangler types
```

## 构建和部署

### 1. 构建项目
```bash
npm run build
```

### 2. 预览构建
```bash
npm run preview
```

### 3. 部署到 Cloudflare Workers
```bash
npm run deploy
```

### 4. 监控日志
```bash
npx wrangler tail
```

## 环境变量和秘密

### 设置环境变量
```bash
npx wrangler secret put MY_SECRET
```

### 列出绑定
```bash
npx wrangler kv:namespace list
npx wrangler r2 bucket list
```

## 故障排除

### 1. 类型错误
如果遇到 TypeScript 类型错误:
```bash
npm run cf-typegen
```

### 2. 构建失败
清理并重新构建:
```bash
rm -rf dist node_modules/.vite
npm run build
```

### 3. 部署失败
检查 Wrangler 配置:
```bash
npx wrangler whoami
npx wrangler deploy --dry-run
```

### 4. R2 权限问题
确保 Worker 有 R2 bucket 的读写权限:
1. 在 Cloudflare Dashboard 中导航到 Workers & Pages
2. 选择你的 Worker
3. 点击 **Settings** → **Variables**
4. 确保 R2 bucket 绑定正确配置

## API 文档

### 文件管理 API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/files` | 列出所有文件 |
| POST | `/api/files/upload` | 上传文件 |
| GET | `/api/files/:key` | 获取文件 |
| DELETE | `/api/files/:key` | 删除文件 |

### 示例请求

```bash
# 列出文件
curl https://your-worker.workers.dev/api/files

# 上传文件
curl -X POST -F "file=@document.pdf" https://your-worker.workers.dev/api/files/upload

# 获取文件
curl https://your-worker.workers.dev/api/files/document.pdf

# 删除文件
curl -X DELETE https://your-worker.workers.dev/api/files/document.pdf
```

## 性能优化

### 1. 启用智能放置
在 `wrangler.json` 中取消注释:
```json
"placement": { "mode": "smart" }
```

### 2. 启用源映射
已默认启用:
```json
"upload_source_maps": true
```

### 3. 启用可观察性
已默认启用:
```json
"observability": { "enabled": true }
```
