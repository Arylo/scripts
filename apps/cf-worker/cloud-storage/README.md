# React + Vite + Hono + Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

This template provides a minimal setup for building a React application with TypeScript and Vite, designed to run on Cloudflare Workers. It features hot module replacement, ESLint integration, and the flexibility of Workers deployments.

![React + TypeScript + Vite + Cloudflare Workers](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

<!-- dash-content-start -->

🚀 Supercharge your web development with this powerful stack:

- [**React**](https://react.dev/) - A modern UI library for building interactive interfaces
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server
- [**Hono**](https://hono.dev/) - Ultralight, modern backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform for global deployment

### ✨ Key Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ ESLint configuration included
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🔄 Full-stack development setup
- 🔎 Built-in Observability to monitor your Worker

Get started in minutes with local development or deploy directly via the Cloudflare dashboard. Perfect for building modern, performant web applications at the edge.

<!-- dash-content-end -->

## Getting Started

To start a new project with this template, run:

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/vite-react-template
```

A live deployment of this template is available at:
[https://react-vite-template.templates.workers.dev](https://react-vite-template.templates.workers.dev)

## Development

Install dependencies:

```bash
npm install
```

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run build && npm run deploy
```

Monitor your workers:

```bash
npx wrangler tail
```

## R2 Bucket 绑定

此项目已配置 R2 bucket 绑定，名为 `STORAGE_BUCKET`。你可以在 Worker 代码中通过 `c.env.STORAGE_BUCKET` 访问 R2 bucket。

### 可用 API 端点

1. **列出文件** - `GET /api/files`
   ```bash
   curl http://localhost:8787/api/files
   ```
3. **获取文件** - `GET /api/files/:key`
   ```bash
   curl http://localhost:8787/api/files/your-file-key
   ```

### 配置 R2 Bucket

1. 在 Cloudflare Dashboard 中创建 R2 bucket：
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 导航到 R2 → Create bucket
   - 输入 bucket 名称（例如：`cloud-storage-bucket`）

2. 更新 `wrangler.json` 中的 bucket 名称（如果需要）：
   ```json
   "r2_buckets": [
     {
       "binding": "STORAGE_BUCKET",
       "bucket_name": "your-bucket-name"
     }
   ]
   ```

3. 部署 Worker：
   ```bash
   npm run build && npm run deploy
   ```

### TypeScript 类型

运行以下命令生成类型定义：
```bash
npx wrangler types
```

这将在 `worker-configuration.d.ts` 中生成 `STORAGE_BUCKET: R2Bucket` 类型。

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
