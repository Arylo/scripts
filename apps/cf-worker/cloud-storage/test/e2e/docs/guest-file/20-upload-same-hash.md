# 场景二十：上传同名文件覆盖（相同 hash）

**前置条件**：`canUpload` 为 `true`，分享盘中已存在文件 `file.txt`（hash 为 `H`）。

**步骤**：
1. 向 `POST /api/upload/H/file.txt` 发送请求（关联同 hash 文件，相同名称）。
2. 断言响应状态码为 `200`，消息为 `File already exists in this Pan`。
3. 向 `GET /api/list` 确认列表中该文件名仍只出现一次。
