# 场景一：通过提取码获取文件列表（取件）

**前置条件**：分享盘处于启用状态，提取码处于启用状态，分享盘下有文件。

**步骤**：
1. 向 `GET /api/list?code=<value>` 发送请求（不携带 Cookie）。
2. 断言响应状态码为 `200`。
3. 断言响应体结构：
   ```json
   {
     "code": 200,
     "perms": { "canDownload": true, "canUpload": false, "canDelete": false },
     "data": [ ...doc ],
     "total": <number>
   }
   ```
4. 断言 `data` 中每条记录包含 `id`、`hash`、`originalName`、`highlight`、`size`、`mimetype` 字段。
5. 断言响应写入了 Pan Session Cookie（后续无需再传 `code` 参数）。
