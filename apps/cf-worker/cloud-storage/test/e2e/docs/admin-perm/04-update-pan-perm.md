# 场景四：更新分享盘权限值

**前置条件**：分享盘已存在 `canDownload` 权限记录（`perm_id`），当前值为 `true`。

**步骤**：
1. **[管理端]** 向 `PUT /api/admin/pans/:pan_id/perms/:perm_id` 发送请求，请求体：
   ```json
   { "value": false }
   ```
2. **[管理端]** 断言响应状态码为 `200`。
3. **[管理端]** 调用 `GET /api/admin/pans/:pan_id` 确认 `perms` 中对应记录的 `value` 已变为 `false`。
4. **[访客端]** 通过对应提取码调用文件下载接口，断言返回 `403`（无下载权限）。
