# 场景十：同一分享盘创建多个提取码

**前置条件**：已存在分享盘（`pan_id`）。

**步骤**：
1. 连续向 `POST /api/admin/pans/:pan_id/codes` 发送两次请求。
2. 断言两次均返回 `200`，且生成的 `code.value` 不同。
3. 向 `GET /api/admin/pans/:pan_id` 确认 `codes` 列表中包含两个提取码。
4. 通过 `GET /api/admin/codes` 确认两个提取码的 `panId` 均指向同一分享盘。
