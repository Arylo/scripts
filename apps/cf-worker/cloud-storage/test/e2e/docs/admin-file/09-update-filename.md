# 场景九：更新文件名

**前置条件**：分享盘下已存在文件（`file_hash` 已知，当前 `originalName` 为 `old_name.txt`）。

**步骤**：
1. **[管理端]** 向 `PUT /api/admin/pans/:pan_id/files/:file_hash` 发送请求，请求体：
   ```json
   { "originalName": "new_name.txt" }
   ```
2. **[管理端]** 断言响应状态码为 `200`。
3. **[管理端]** 调用 `GET /api/admin/pans/:pan_id` 确认 `docs` 中该文件的 `originalName` 已变为 `new_name.txt`。
4. **[访客端]** 向 `GET /api/raw/new_name.txt` 发送请求，断言下载成功；向 `GET /api/raw/old_name.txt` 发送请求，断言返回 `404`。
