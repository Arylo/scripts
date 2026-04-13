# 场景十七：不携带 Cookie 且不传 code 参数时无法访问

**步骤**：
1. 不携带 Cookie 和 `code` 参数，向 `GET /api/list` 发送请求。
2. 断言响应状态码为 `401`。
