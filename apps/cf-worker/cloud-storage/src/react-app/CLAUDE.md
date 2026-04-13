# React App CLAUDE.md

基于 **React + React Router v7** 的前端 SPA。

## 路由结构

```
/                          → Home（访客首页，输入 code）
/pan/:code                 → Detail（文件列表 / 预览）
/pan/:code/:fileHash       → Detail（指定文件预览）
/admin/login               → Login
/admin/logout              → Logout
/admin/session-expired     → SessionExpired
/admin/dashboard           → AdminPans（等同 /admin/pans）
/admin/pans                → AdminPans
/admin/pans/:pan_id        → AdminPanDetail（含文件管理）
/admin/pans/:pan_id/codes/:code_id → AdminCodeDetail
/admin/codes               → AdminCodes
```

所有路由按需懒加载（`React.lazy`）。

## 目录说明

| 目录 | 说明 |
|------|------|
| `Pages/` | 页面组件，按功能分目录 |
| `Components/` | 通用组件（Button、Card、TableCell、shadcn/ui） |
| `requests/` | API 请求函数（每个操作独立文件） |
| `hooks/` | 数据获取 hooks（useFileList、usePanInfo、usePanPerms 等） |
| `utils/` | adminFetch / guestFetch 封装、工具函数 |
| `lib/` | 通用工具（cn 等） |

## 请求工具

- `adminFetch` — 自动携带 session，401 时跳转 `/admin/session-expired`
- `guestFetch` — 普通 fetch 封装，用于访客接口

## UI 组件

使用 **shadcn/ui**，组件存放于 `Components/ui/`。
