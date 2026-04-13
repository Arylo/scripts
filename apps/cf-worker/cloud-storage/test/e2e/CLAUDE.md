# E2E 测试场景文档

## 目录结构

```
docs/
  admin-auth/    # 管理员认证（登录 / 登出 / Token）
  admin-pan/     # 分享盘 CRUD 及状态管理
  admin-code/    # 提取码 CRUD 及状态管理
  admin-perm/    # 权限管理（PanPerm / CodePerm）
  admin-file/    # 文件上传 / 编辑 / 删除
  guest-file/    # 访客取件（文件列表 / 下载 / 上传 / 删除）
```

## 文件命名规范

`<序号两位数>-<kebab-case-描述>.md`，例如：`01-login-success.md`。

## 文档格式

```markdown
# 场景N：<中文标题>

**前置条件**：<描述前置依赖或状态>

**步骤**：
1. <步骤描述>
2. ...
```

### 角色标签

当场景涉及管理端与访客端的混合操作时，在步骤前标注角色：

- `**[管理端]**` — 由管理员（携带 `user_token` Cookie）执行的步骤
- `**[访客端]**` — 由匿名访客（携带 Pan Session Cookie 或 `?code=` 参数）执行的步骤

纯管理端目录（`admin-*`）或纯访客端目录（`guest-file`）中、无混合操作的文件无需标注。

## API 端点速查

| 端点 | 角色 | 说明 |
|------|------|------|
| `POST /api/admin/login` | 管理端 | 登录 |
| `DELETE /api/admin/logout` | 管理端 | 登出 |
| `GET/POST/PUT/DELETE /api/admin/pans` | 管理端 | 分享盘管理 |
| `GET/POST/PUT/DELETE /api/admin/codes` | 管理端 | 提取码管理 |
| `GET/POST/PUT/DELETE /api/admin/perms` | 管理端 | 权限管理 |
| `POST/PUT/DELETE /api/admin/files` | 管理端 | 文件管理 |
| `GET /api/list` | 访客端 | 获取文件列表（需 `?code=` 或 Session Cookie） |
| `GET /api/download/:hash` | 访客端 | 下载文件 |
| `POST /api/upload` | 访客端 | 上传文件 |
| `DELETE /api/delete/:id` | 访客端 | 删除文件 |
