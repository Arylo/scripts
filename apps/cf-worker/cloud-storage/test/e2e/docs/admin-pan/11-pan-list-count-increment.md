# 场景十一：分享盘列表在新增后数量递增

**步骤**：
1. 向 `GET /api/admin/pans` 获取当前 `size`（记为 `n`）。
2. 新建一个分享盘。
3. 再次向 `GET /api/admin/pans` 发送请求，断言 `size` 为 `n + 1`。
