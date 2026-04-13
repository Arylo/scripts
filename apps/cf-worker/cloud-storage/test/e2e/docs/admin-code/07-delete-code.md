# 场景七：删除提取码

**前置条件**：已存在提取码（`code_id`），且该码配置了权限。

**步骤**：
1. 向 `DELETE /api/admin/pans/:pan_id/codes/:code_id` 发送请求。
2. 断言响应状态码为 `200`。
3. 向 `GET /api/admin/pans/:pan_id/codes/:code_id` 确认返回 `404`（码已不存在）。
4. 确认关联的权限记录也已被清理。
