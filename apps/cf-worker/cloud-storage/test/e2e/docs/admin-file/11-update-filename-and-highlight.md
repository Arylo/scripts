# 场景十一：同时更新文件名和高亮

**步骤**：
1. 向 `PUT /api/admin/pans/:pan_id/files/:file_hash` 发送请求，请求体：
   ```json
   { "originalName": "renamed.txt", "highlight": 1 }
   ```
2. 断言响应状态码为 `200`。
3. 验证 `originalName` 和 `highlight` 均已更新。
