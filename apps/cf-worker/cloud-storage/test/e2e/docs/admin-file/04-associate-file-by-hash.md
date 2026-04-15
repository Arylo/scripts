# 场景四：通过 hash 关联已存在文件

**前置条件**：已有文件的 `file_hash` 存在于存储中（通过其他 Pan 上传或已知）。

**步骤**：
1. 向 `POST /api/admin/pans/:pan_id/files/:file_hash/:file_name` 发送请求（无需请求体）。
2. 断言响应状态码为 `200`。
3. 调用 `GET /api/admin/pans/:pan_id` 确认文件已关联到该 Pan，且 `originalName` 与 `file_name` 一致。
