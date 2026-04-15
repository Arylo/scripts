# 场景一：为分享盘添加上传权限

**前置条件**：已存在分享盘（`pan_id`），且该盘尚未配置 `canUpload` 权限。

**步骤**：
1. **[管理端]** 向 `POST /api/admin/pans/:pan_id/perms` 发送请求，请求体：
   ```json
   { "type": "canUpload", "value": true }
   ```
2. **[管理端]** 断言响应状态码为 `200`。
3. **[管理端]** 断言响应体包含新建的 `perm` 记录（含 `id`、`type`、`value`）。
4. **[访客端]** 通过对应提取码调用 `POST /api/upload/:file_hash`，断言可以成功上传。
