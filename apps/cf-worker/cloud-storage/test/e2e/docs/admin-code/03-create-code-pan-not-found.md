# 场景三：新建提取码 - 分享盘不存在

**步骤**：
1. 向 `POST /api/admin/pans/nonexistent_id/codes` 发送请求。
2. 断言响应状态码为 `404`。
