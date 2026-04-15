# 场景六：为提取码独立配置删除权限

**前置条件**：已存在分享盘、提取码（`code_id`），且 PanPerm 未设置 `canDelete`（默认 `false`）。

**步骤**：
1. **[管理端]** 向 `POST /api/admin/pans/:pan_id/codes/:code_id/perms` 发送请求，请求体：
   ```json
   { "type": "canDelete", "value": true }
   ```
2. **[管理端]** 断言响应状态码为 `200`。
3. **[访客端]** 使用该提取码调用 `DELETE /api/list/files/:file_name`，断言可成功删除文件。
