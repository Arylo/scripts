# 场景八：删除文件（有删除权限）

**前置条件**：`canDelete` 为 `true`，分享盘中存在文件 `file_name`。

**步骤**：
1. 携带 Cookie，向 `DELETE /api/list/files/:file_name` 发送请求。
2. 断言响应状态码为 `200`，消息为 `File deleted successfully`。
3. 向 `GET /api/list` 确认文件已从列表中消失。
4. 向 `GET /api/raw/:file_name` 确认返回 `404`（文件已不存在）。
