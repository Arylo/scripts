# 场景六：更新提取码状态（启用 / 禁用）

**前置条件**：已存在提取码（`code_id`），当前状态为 `active: 1`。

**步骤（禁用）**：
1. **[管理端]** 向 `PUT /api/admin/pans/:pan_id/codes/:code_id` 发送请求，请求体：
   ```json
   { "active": 0 }
   ```
2. **[管理端]** 断言响应状态码为 `200`。
3. **[管理端]** 向 `GET /api/admin/pans/:pan_id/codes/:code_id` 验证 `active` 已变为 `0`。
4. **[访客端]** 使用该提取码访问 `GET /api/list?code=<value>`，断言返回 `403` 或 `404`（码已禁用，无法取件）。

**步骤（重新启用）**：
1. **[管理端]** 向 `PUT /api/admin/pans/:pan_id/codes/:code_id` 发送请求，请求体：
   ```json
   { "active": 1 }
   ```
2. **[管理端]** 断言响应状态码为 `200`。
3. **[访客端]** 验证访客可再次使用该码取件（向 `GET /api/list?code=<value>` 发送请求，断言返回 `200`）。
