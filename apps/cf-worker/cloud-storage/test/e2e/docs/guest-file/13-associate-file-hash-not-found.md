# 场景十三：通过 hash 关联文件 - hash 不存在

**前置条件**：`canUpload` 为 `true`。

**步骤**：
1. 向 `POST /api/upload/nonexistent_hash/test.txt` 发送请求。
2. 断言响应状态码为 `404`（hash 不在存储中）。
