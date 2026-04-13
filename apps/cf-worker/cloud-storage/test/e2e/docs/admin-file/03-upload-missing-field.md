# 场景三：上传文件 - 未包含 file 字段

**步骤**：
1. 向 `POST /api/admin/pans/:pan_id/files` 发送空 `multipart/form-data`（无 `file` 字段）。
2. 断言响应状态码为 `400`，并包含相应错误提示。
