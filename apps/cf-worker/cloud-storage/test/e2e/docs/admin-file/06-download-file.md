# 场景六：下载分享盘中的文件

**前置条件**：分享盘下已存在文件（`file_hash` 已知）。

**步骤**：
1. 向 `GET /api/admin/pans/:pan_id/files/:file_hash` 发送请求。
2. 断言响应状态码为 `200`。
3. 断言响应头 `Content-Disposition` 包含正确的 `filename`（经 URL 编码的原始文件名）。
4. 断言响应体为文件内容的二进制流。
