# 场景四：获取不存在的分享盘详情

**步骤**：
1. 向 `GET /api/admin/pans/nonexistent_id` 发送请求。
2. 断言响应状态码为 `404`。
