# 场景九：禁用分享盘后访客无法访问

**前置条件**：分享盘启用，已有可用提取码。

**步骤**：
1. **[管理端]** 向 `PUT /api/admin/pans/:pan_id` 发送 `{ "active": 0 }` 禁用分享盘。
2. **[访客端]** 向 `GET /api/list?code=<value>` 发送请求，断言返回 `403` 或 `404`。
3. **[管理端]** 重新向 `PUT /api/admin/pans/:pan_id` 发送 `{ "active": 1 }` 启用分享盘。
4. **[访客端]** 再次向 `GET /api/list?code=<value>` 发送请求，断言返回 `200`。
