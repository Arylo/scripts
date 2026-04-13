# 场景十二：分享盘列表在删除后数量递减

**前置条件**：已存在至少一个分享盘（`pan_id`）。

**步骤**：
1. 向 `GET /api/admin/pans` 获取当前 `size`（记为 `n`）。
2. 向 `DELETE /api/admin/pans/:pan_id` 删除该分享盘。
3. 再次向 `GET /api/admin/pans` 发送请求，断言 `size` 为 `n - 1`。
