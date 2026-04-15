# 名词对照表

## 业务名词

| 名词 | 中文 | 说明 |
|------|------|------|
| Pan | 分享盘 | 一个独立的文件集合，可关联多个提取码和权限 |
| Code | 提取码 | 匿名用户凭此访问分享盘；可启用 / 禁用 |
| Doc | 文件 | 实际存储的文件元信息（hash、mimetype、size），二进制内容存于 R2 |
| PanDoc | 分享盘文件关联 | Pan 与 Doc 的多对多中间表，包含显示名（originalName）和高亮标志 |
| PanCode | 分享盘提取码关联 | Pan 与 Code 的关联，决定某提取码可访问哪个分享盘 |
| Perm | 权限 | 枚举类型权限项（canDownload / canUpload / canDelete） |
| PanPerm | 分享盘权限 | 为某个 Pan 设置的全局权限 |
| CodePerm | 提取码权限 | 为某个 Code 单独覆盖的权限，优先级高于 PanPerm |
| highlight | 高亮 | PanDoc 字段；高亮文件在取件页面中排列于列表首位并突出展示 |

## 技术名词

| 名词 | 说明 |
|------|------|
| D1 | Cloudflare 托管的 SQLite 数据库，存储所有业务结构化数据 |
| KV | Cloudflare KV 键值存储；存储 session token 及壁纸缓存 |
| R2 | Cloudflare R2 对象存储；存储文件二进制内容，以文件 MD5 hash 为 key |
| `user_token` | 管理员登录后写入 Cookie 的 session token |
| `share_token` | 匿名用户取件后写入 Cookie 的 session token，对应 Code ID |
| ULID | 时间有序唯一 ID，所有数据表主键均使用此格式 |
