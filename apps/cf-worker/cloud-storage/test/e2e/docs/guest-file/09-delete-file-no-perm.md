# 场景九：删除文件（无删除权限）

**前置条件**：`canDelete` 为 `false`（默认值）。

**步骤**：
1. 携带 Cookie，向 `DELETE /api/list/files/:file_name` 发送请求。
2. 断言响应状态码为 `403`，响应体包含 `No permission`。
