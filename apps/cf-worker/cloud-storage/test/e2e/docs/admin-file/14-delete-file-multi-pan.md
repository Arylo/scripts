# 场景十四：删除分享盘中的文件（文件被多个盘共享）

**前置条件**：同一 `file_hash` 关联到两个不同分享盘（Pan A 和 Pan B）。

**步骤**：
1. 向 `DELETE /api/admin/pans/<pan_a_id>/files/:file_hash` 发送请求，仅删除 Pan A 中的关联。
2. 断言响应状态码为 `200`。
3. 调用 `GET /api/admin/pans/<pan_b_id>` 确认文件仍存在于 Pan B 的 `docs` 列表。
4. 向 `GET /api/admin/pans/<pan_b_id>/files/:file_hash` 发送请求，断言仍可正常下载（R2 文件未删除）。
