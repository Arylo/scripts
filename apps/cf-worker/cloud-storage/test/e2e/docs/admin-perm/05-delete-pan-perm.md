# 场景五：删除分享盘权限（恢复默认）

**前置条件**：分享盘已存在 `canUpload` 权限记录（值为 `true`，`perm_id` 已知）。

**步骤**：
1. **[管理端]** 向 `DELETE /api/admin/pans/:pan_id/perms/:perm_id` 发送请求。
2. **[管理端]** 断言响应状态码为 `200`。
3. **[管理端]** 调用 `GET /api/admin/pans/:pan_id` 确认 `perms` 中该记录已不存在。
4. **[访客端]** 访问文件列表，断言 `perms.canUpload` 为 `false`（恢复默认值）。
