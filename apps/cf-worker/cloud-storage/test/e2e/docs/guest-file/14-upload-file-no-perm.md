# 场景十四：上传文件（无上传权限）

**前置条件**：`canUpload` 为 `false`（默认值）。

**步骤**：
1. 携带 Cookie，向 `POST /api/upload/:file_hash` 发送请求。
2. 断言响应状态码为 `403`，响应体包含 `No permission`。
