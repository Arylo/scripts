# 场景一：上传新文件（multipart）

**前置条件**：已存在分享盘（`pan_id`），文件尚未上传过。

**步骤**：
1. 向 `POST /api/admin/pans/:pan_id/files` 发送 `multipart/form-data` 请求，包含 `file` 字段。
2. 断言响应状态码为 `200`。
3. 断言响应体包含文件信息：
   ```json
   { "hash": "...", "filename": "...", "mimetype": "...", "size": <number> }
   ```
4. 调用 `GET /api/admin/pans/:pan_id` 确认文件出现在 `docs` 列表中。
