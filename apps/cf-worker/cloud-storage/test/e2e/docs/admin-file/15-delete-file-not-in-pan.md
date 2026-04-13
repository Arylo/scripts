# 场景十五：删除文件 - 文件不在该分享盘中

**步骤**：
1. 向 `DELETE /api/admin/pans/:pan_id/files/nonexistent_hash` 发送请求（hash 不属于该 Pan）。
2. 断言响应状态码为 `404`。
