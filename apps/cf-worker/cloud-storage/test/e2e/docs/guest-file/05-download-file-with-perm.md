# 场景五：下载文件（有下载权限）

**前置条件**：取件成功，`perms.canDownload` 为 `true`，文件名 `file_name` 已知。

**步骤**：
1. 携带 Cookie，向 `GET /api/raw/:file_name` 发送请求。
2. 断言响应状态码为 `200`。
3. 断言响应头 `Content-Disposition` 包含正确的文件名（URL 编码格式）。
4. 断言响应体为文件二进制内容。
