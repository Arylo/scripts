# 场景十一：上传新文件（multipart，有上传权限）

**前置条件**：`canUpload` 为 `true`。

**步骤**：
1. 携带 Cookie，向 `POST /api/upload/:file_hash` 发送 `multipart/form-data` 请求，包含 `file` 字段。
2. 断言响应状态码为 `200`。
3. 向 `GET /api/list` 确认新文件出现在列表中。
