# 场景十：权限 perm_id 归属校验（跨资源访问）

**前置条件**：Pan A 有 Perm A（`perm_a_id`）；Pan B 是另一个独立分享盘。

**步骤**：
1. 向 `DELETE /api/admin/pans/<pan_b_id>/perms/<perm_a_id>` 发送请求（用 Pan B 路径访问属于 Pan A 的权限）。
2. 断言响应状态码为 `404`（权限不属于该分享盘）。
3. 向 `PUT /api/admin/pans/<pan_b_id>/perms/<perm_a_id>` 同样断言 `404`。
