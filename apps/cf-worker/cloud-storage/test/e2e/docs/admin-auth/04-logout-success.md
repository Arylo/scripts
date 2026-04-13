# 场景四：登出成功

**前置条件**：已完成登录，具有有效 `user_token` Cookie。

**步骤**：
1. 向 `POST /api/admin/logout` 发送请求，携带有效 Cookie。
2. 断言响应状态码为 `200`。
3. 断言响应 `Set-Cookie` 清除了 `user_token`（如 `Max-Age=0` 或 `Expires` 为过去时间）。
4. 断言使用旧 Cookie 再次请求受保护接口，返回 `401`。
