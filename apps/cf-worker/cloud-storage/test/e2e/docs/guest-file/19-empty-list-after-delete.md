# 场景十九：删除最后一个文件后列表为空

**前置条件**：`canDelete` 为 `true`，分享盘中只剩一个文件。

**步骤**：
1. 向 `DELETE /api/list/files/:file_name` 删除最后一个文件，断言 `200`。
2. 向 `GET /api/list` 获取列表，断言 `data` 为空数组，`total` 为 `0`。
