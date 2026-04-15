# 场景十三：删除分享盘中的文件（文件仅属于该盘）

**前置条件**：文件仅关联到当前分享盘，不与其他 Pan 共享。

**步骤**：
1. 向 `DELETE /api/admin/pans/:pan_id/files/:file_hash` 发送请求。
2. 断言响应状态码为 `200`。
3. 调用 `GET /api/admin/pans/:pan_id` 确认文件从 `docs` 列表中消失。
4. 向 `GET /api/admin/pans/:pan_id/files/:file_hash` 发送请求，断言返回 `404`（R2 中文件也已删除）。
