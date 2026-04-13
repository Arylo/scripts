# 场景十二：提取码禁用后访客无法取件

**前置条件**：分享盘启用，提取码 `active` 为 `1`，`value` 为 `<code_value>`。

**步骤（禁用）**：
1. **[管理端]** 向 `PUT /api/admin/pans/:pan_id/codes/:code_id` 发送 `{ "active": 0 }`。
2. **[管理端]** 断言响应状态码为 `200`。
3. **[访客端]** 向 `GET /api/list?code=<code_value>` 发送请求，断言返回 `403` 或 `404`（提取码已禁用）。

**步骤（重新启用后访客恢复访问）**：
1. **[管理端]** 向 `PUT /api/admin/pans/:pan_id/codes/:code_id` 发送 `{ "active": 1 }`。
2. **[访客端]** 再次向 `GET /api/list?code=<code_value>` 发送请求，断言返回 `200`。
