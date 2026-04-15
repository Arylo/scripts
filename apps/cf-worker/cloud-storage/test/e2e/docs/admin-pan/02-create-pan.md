# 场景二：新建分享盘

**步骤**：
1. 向 `POST /api/admin/pans` 发送请求（无需请求体）。
2. 断言响应状态码为 `200`。
3. 断言响应体包含新建的 Pan 记录（含 `id`、`active`、`createdAt`）。
4. 向 `GET /api/admin/pans` 发送请求，确认列表中包含新建的 Pan。
