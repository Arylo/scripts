# 场景十六：Cookie 持久性 - 无需重复传 code 参数

**前置条件**：已通过 `GET /api/list?code=<value>` 完成取件，浏览器写入 Pan Session Cookie。

**步骤**：
1. 携带 Cookie，连续发送三次 `GET /api/list`（不带 `code` 参数）。
2. 三次均断言响应状态码为 `200`，且文件列表一致。
3. 删除 Cookie 后再次请求，断言返回 `401`。
