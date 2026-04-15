# 场景七：提取码权限覆盖分享盘权限

**前置条件**：分享盘 `canDownload` 全局值为 `true`（PanPerm），提取码尚无 CodePerm。

**步骤**：
1. **[管理端]** 为提取码添加 `canDownload: false` 的 CodePerm。
2. **[访客端]** 使用该提取码调用下载接口，断言返回 `403`（CodePerm 覆盖 PanPerm）。
3. **[访客端]** 使用同一分享盘的其他提取码（无 CodePerm）下载同一文件，断言下载成功（仍沿用 PanPerm 的 `true`）。
