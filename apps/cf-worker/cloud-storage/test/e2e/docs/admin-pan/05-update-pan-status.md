# 场景五：更新分享盘状态（启用 / 禁用）

**前置条件**：已存在至少一个分享盘（`pan_id`），当前状态为 `active: 1`。

**步骤（禁用）**：
1. 向 `PUT /api/admin/pans/:pan_id` 发送请求，请求体：
   ```json
   { "active": 0 }
   ```
2. 断言响应状态码为 `200`。
3. 向 `GET /api/admin/pans/:pan_id` 验证 `active` 字段已变为 `0`。

**步骤（重新启用）**：
1. 向 `PUT /api/admin/pans/:pan_id` 发送请求，请求体：
   ```json
   { "active": 1 }
   ```
2. 断言响应状态码为 `200`。
3. 验证 `active` 字段恢复为 `1`。
