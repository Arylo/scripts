# 场景十一：删除分享盘时其权限记录同步清理

**前置条件**：分享盘已配置 `canUpload` 的 PanPerm（`perm_id`）。

**步骤**：
1. 向 `DELETE /api/admin/pans/:pan_id` 删除该分享盘。
2. 断言响应状态码为 `200`。
3. 尝试向 `DELETE /api/admin/pans/:pan_id/perms/:perm_id` 发送请求，断言 `404`（分享盘及权限均已不存在）。
