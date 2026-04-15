# 场景一：获取所有提取码列表

**步骤**：
1. 向 `GET /api/admin/codes` 发送请求。
2. 断言响应状态码为 `200`。
3. 断言响应体结构：
   ```json
   { "code": 200, "size": <number>, "data": [ ...code ] }
   ```
4. 断言每条提取码记录包含 `id`、`value`、`active`、`panId`、`updatedAt`、`createdAt` 字段。
