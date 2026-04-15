# 场景十一：跨分享盘访问提取码（归属校验）

**前置条件**：Pan A（`pan_a_id`）创建了提取码 Code A（`code_a_id`）；Pan B（`pan_b_id`）是另一个独立分享盘。

**步骤**：
1. 向 `GET /api/admin/pans/<pan_b_id>/codes/<code_a_id>` 发送请求（使用 Pan B 的路径访问属于 Pan A 的提取码）。
2. 断言响应状态码为 `404`（提取码不属于该分享盘）。
3. 向 `DELETE /api/admin/pans/<pan_b_id>/codes/<code_a_id>` 发送请求，同样断言 `404`。
