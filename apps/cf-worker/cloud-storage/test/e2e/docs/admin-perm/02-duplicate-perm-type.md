# 场景二：重复添加同一类型权限

**前置条件**：分享盘已存在 `canUpload` 权限记录。

**步骤**：
1. 再次向 `POST /api/admin/pans/:pan_id/perms` 发送 `{ "type": "canUpload", "value": true }`。
2. 断言响应状态码为 `400`，并包含 `Perm type already exists` 错误信息。
