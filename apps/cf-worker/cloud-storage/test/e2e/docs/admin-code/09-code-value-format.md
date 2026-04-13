# 场景九：提取码 value 格式验证

**步骤**：
1. 连续新建三个提取码（`POST /api/admin/pans/:pan_id/codes`）。
2. 断言每个 `code.value` 均满足正则 `/^[a-z0-9]{8}$/`，且三者互不相同。
