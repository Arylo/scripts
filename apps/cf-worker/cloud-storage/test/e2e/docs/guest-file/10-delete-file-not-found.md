# 场景十：删除不存在的文件

**前置条件**：取件成功，有删除权限。

**步骤**：
1. 向 `DELETE /api/list/files/nonexistent_file.txt` 发送请求。
2. 断言响应状态码为 `404`。
