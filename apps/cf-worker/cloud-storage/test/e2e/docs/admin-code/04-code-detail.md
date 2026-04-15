# 场景四：获取单个提取码详情

**前置条件**：已存在分享盘（`pan_id`）及关联提取码（`code_id`）。

**步骤**：
1. 向 `GET /api/admin/pans/:pan_id/codes/:code_id` 发送请求。
2. 断言响应状态码为 `200`。
3. 断言响应体结构包含提取码基本信息和 `perms` 数组：
   ```json
   { "code": 200, "data": { "id": "...", "value": "...", "active": 1, "perms": [...] } }
   ```
