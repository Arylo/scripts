# 场景十三：删除分享盘后，关联提取码同步清理

**前置条件**：分享盘（`pan_id`）下存在提取码（`code_id`）。

**步骤**：
1. **[管理端]** 向 `DELETE /api/admin/pans/:pan_id` 删除分享盘。
2. **[管理端]** 向 `GET /api/admin/codes` 获取列表，断言已不包含该提取码。
3. **[访客端]** 向 `GET /api/list?code=<code_value>` 发送请求，断言返回 `404`（分享盘及提取码均已不存在）。
