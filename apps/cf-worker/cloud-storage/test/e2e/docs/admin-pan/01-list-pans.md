# 场景一：获取分享盘列表

**步骤**：
1. 向 `GET /api/admin/pans` 发送请求。
2. 断言响应状态码为 `200`。
3. 断言响应体结构：
   ```json
   { "code": 200, "size": <number>, "data": [ ...pan ] }
   ```
4. 断言 `data` 中每条记录包含 `id`、`active`、`updatedAt`、`createdAt` 字段。
