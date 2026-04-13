# 场景七：下载文件 - 文件不存在

**步骤**：
1. 向 `GET /api/admin/pans/:pan_id/files/nonexistent_hash` 发送请求（pan_id 有效）。
2. 断言响应状态码为 `404`。
