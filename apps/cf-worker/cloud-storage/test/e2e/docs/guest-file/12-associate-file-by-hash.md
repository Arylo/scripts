# 场景十二：通过 hash 快速关联文件（有上传权限）

**前置条件**：`canUpload` 为 `true`，目标 `file_hash` 已在 R2 存储中存在。

**步骤**：
1. 携带 Cookie，向 `POST /api/upload/:file_hash/:file_name` 发送请求（无需请求体）。
2. 断言响应状态码为 `200`。
3. 向 `GET /api/list` 确认文件出现在列表中，且 `originalName` 与 `file_name` 一致。
