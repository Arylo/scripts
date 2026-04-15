# 场景三：添加无效权限类型

**步骤**：
1. 向 `POST /api/admin/pans/:pan_id/perms` 发送 `{ "type": "invalidType", "value": true }`。
2. 断言响应状态码为 `400`。
