# 场景二：提取码无效或已禁用

**步骤**：
1. 向 `GET /api/list?code=invalidcode` 发送请求。
2. 断言响应状态码为 `404` 或 `403`。
