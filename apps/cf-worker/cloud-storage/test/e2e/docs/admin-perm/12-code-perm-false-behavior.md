# 场景十二：提取码权限 value 为 false 时行为与无权限记录一致

**前置条件**：PanPerm `canUpload` 设为 `true`，为某个提取码单独配置 `canUpload: false` 的 CodePerm。

**步骤**：
1. **[访客端]** 通过该提取码访问文件列表（`GET /api/list`），断言 `perms.canUpload` 为 `false`。
2. **[访客端]** 尝试通过该提取码上传文件，断言返回 `403`。
3. **[访客端]** 通过同一分享盘的另一提取码（无 CodePerm）上传文件，断言成功（沿用 PanPerm `true`）。
