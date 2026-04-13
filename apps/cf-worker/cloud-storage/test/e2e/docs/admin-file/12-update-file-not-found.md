# 场景十二：更新不存在的文件

**步骤**：
1. 向 `PUT /api/admin/pans/:pan_id/files/nonexistent_hash` 发送请求，请求体：
   ```json
   { "originalName": "test.txt" }
   ```
2. 断言响应状态码为 `404`。
