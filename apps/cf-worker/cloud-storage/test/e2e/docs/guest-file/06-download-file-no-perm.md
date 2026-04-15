# 场景六：下载文件（无下载权限）

**前置条件**：`canDownload` 权限被设置为 `false`。

**步骤**：
1. 携带 Cookie，向 `GET /api/raw/:file_name` 发送请求。
2. 断言响应状态码为 `403`，响应体包含 `No permission`。
