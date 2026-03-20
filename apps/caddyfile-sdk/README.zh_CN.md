# @arylo/caddyfile-sdk

[![GitHub license][license_icon]][license_href]

[license_icon]: https://img.shields.io/github/license/arylo/scripts.svg?style=flat-square&logo=github&cacheSecond=7200
[license_href]: https://github.com/arylo/scripts/

[English](./README.md) | [简体中文](./README.zh_CN.md)

用于解析、操作和生成 Caddyfile 内容的 SDK。

## 特性

- 通过类型化 API 创建 Caddyfile 结构
- 将已有的 Caddyfile 文本解析为可编辑对象
- 通过 `toString()` 生成 Caddyfile 文本
- 支持全局块、片段块、站点块、匹配器块、指令块和注释块
- 约束常见唯一性规则，例如根级只能存在一个全局块

## 安装

```bash
npm install @arylo/caddyfile-sdk
```

## 用法

### 创建一个 Caddyfile

```ts
import { createCaddyfile } from '@arylo/caddyfile-sdk'

const caddyfile = createCaddyfile()

const globalBlock = caddyfile.addGlobalBlock()
globalBlock.addDirectiveBlock('email', 'you@yours.com')
globalBlock
  .addDirectiveBlock('servers')
  .addDirectiveBlock('trusted_proxies', 'static', 'private_ranges')

const snippetBlock = caddyfile.addSnippetBlock('snippet')
snippetBlock.addCommentBlock('this is a reusable snippet')
snippetBlock.addDirectiveBlock('log').addDirectiveBlock('output', 'file', '/var/log/access.log')

const siteBlock = caddyfile.addSiteBlock('example.com')
siteBlock.addMatcherBlock('post').addDirectiveBlock('method', 'POST')
siteBlock
  .addDirectiveBlock('reverse_proxy', '@post', 'localhost:9001', 'localhost:9002')
  .addDirectiveBlock('lb_policy', 'first')
siteBlock.addDirectiveBlock('file_server', '/static')
siteBlock.addDirectiveBlock('import', 'snippet')

console.log(caddyfile.toString())
```

输出：

```caddyfile
{
  email you@yours.com
  servers {
    trusted_proxies static private_ranges
  }
}
(snippet) {
  # this is a reusable snippet
  log {
    output file /var/log/access.log
  }
}
example.com {
  @post {
    method POST
  }
  reverse_proxy @post localhost:9001 localhost:9002 {
    lb_policy first
  }
  file_server /static
  import snippet
}
```

### 解析一个 Caddyfile

```ts
import { parseCaddyfile } from '@arylo/caddyfile-sdk'

const caddyfile = parseCaddyfile(`
example.com {
  respond "hello"
}
`)

const siteBlock = caddyfile.listSiteBlock()[0]
siteBlock.addDirectiveBlock('encode', 'gzip')

console.log(caddyfile.toString())
```

## API

### `createCaddyfile()`

创建一个新的空 Caddyfile 对象。

### `parseCaddyfile(text)`

解析 Caddyfile 文本并返回一个可编辑的 Caddyfile 对象。

### 根级块辅助方法

返回的 Caddyfile 对象支持：

- `addGlobalBlock()`
- `removeGlobalBlock()`
- `hasGlobalBlock()`
- `getGlobalBlock()`
- `addSnippetBlock(name)`
- `removeSnippetBlockById(id)`
- `getSnippetBlockByName(name)`
- `listSnippetBlock()`
- `addSiteBlock(name | names)`
- `removeSiteBlockById(id)`
- `getSiteBlockById(id)`
- `listSiteBlock()`
- `addCommentBlock(comment)`
- `removeCommentBlockById(id)`
- `getCommentBlockById(id)`
- `toString()`

嵌套块还提供如下辅助方法：

- `addDirectiveBlock(name, ...args)`
- `addMatcherBlock(name)`
- `addCommentBlock(comment)`

## 约束

- 根级只允许存在一个全局块
- 根级片段名称必须唯一
- 同一父块中的匹配器名称必须唯一
- 同一父块中的指令名称必须唯一
- 站点块至少需要一个站点名称

## 开发

在包目录下执行：

- `npm run lint`
- `npm run test`
- `npm run build`

## 开源证书

[The MIT License.](https://github.com/Arylo/scripts/?tab=MIT-1-ov-file)
