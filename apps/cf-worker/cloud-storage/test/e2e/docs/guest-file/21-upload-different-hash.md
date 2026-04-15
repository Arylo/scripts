# 场景二十一：上传同名文件覆盖（不同 hash，multipart）

**前置条件**：`canUpload` 为 `true`，分享盘中已存在 `report.pdf`，hash 为 `H1`。

**步骤**：
1. 通过 `POST /api/upload/:file_hash`（hash 为 `H2`）上传新版本 `report.pdf`（内容不同）。
2. 断言响应状态码为 `200`。
3. 向 `GET /api/list` 确认列表中 `report.pdf` 的 hash 已更新为 `H2`（旧的 `H1` 关联已被覆盖）。
