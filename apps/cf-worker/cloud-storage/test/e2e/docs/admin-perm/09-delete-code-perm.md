# 场景九：删除提取码权限

**前置条件**：提取码已存在 `canDelete: true` 的 CodePerm（`perm_id`）。

**步骤**：
1. **[管理端]** 向 `DELETE /api/admin/pans/:pan_id/codes/:code_id/perms/:perm_id` 发送请求。
2. **[管理端]** 断言响应状态码为 `200`。
3. **[访客端]** 再次调用删除接口，断言行为回退到 PanPerm 或默认值（`false`，返回 `403`）。
