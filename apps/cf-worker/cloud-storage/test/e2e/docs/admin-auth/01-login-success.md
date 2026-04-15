# 场景一：登录成功

**前置条件**：环境变量 `USERNAME` / `PASSWORD` 已配置。

**步骤**：
1. 向 `POST /api/admin/login` 发送请求，请求体：
   ```json
   { "username": "<USERNAME>", "password": "<SHA1(PASSWORD)>" }
   ```
2. 断言响应状态码为 `200`。
3. 断言响应 `Set-Cookie` 包含 `user_token`。
4. 断言后续携带该 Cookie 请求受保护接口可正常访问。
