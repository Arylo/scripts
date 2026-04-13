# 场景八：更新提取码权限值

**前置条件**：提取码已存在某个权限记录（`perm_id`）。

**步骤**：
1. 向 `PUT /api/admin/pans/:pan_id/codes/:code_id/perms/:perm_id` 发送请求，请求体：
   ```json
   { "value": false }
   ```
2. 断言响应状态码为 `200`。
3. 验证新值已生效（通过 `GET /api/admin/pans/:pan_id/codes/:code_id` 查看 `perms`）。
