# 场景五：通过 hash 关联文件 - hash 不存在

**步骤**：
1. 向 `POST /api/admin/pans/:pan_id/files/nonexistent_hash/test.txt` 发送请求。
2. 断言响应状态码为 `404`（文件 hash 不在存储中）。
