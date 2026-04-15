# 场景八：删除不存在的提取码

**步骤**：
1. 向 `DELETE /api/admin/pans/:pan_id/codes/nonexistent_id` 发送请求（pan_id 有效）。
2. 断言响应状态码为 `404`。
