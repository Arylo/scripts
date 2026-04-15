# 场景七：删除不存在的分享盘

**步骤**：
1. 向 `DELETE /api/admin/pans/nonexistent_id` 发送请求。
2. 断言响应状态码为 `404`。
