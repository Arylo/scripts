# @arylo/esbuild-plugin-html-minify-text

[![MIT-License][LICENSE_URL]][LICENSE_HREF]
[![Author][AUTHOR_URL]][AUTHOR_HREF]
[![PRs Welcome][PRS_URL]][PRS_HREF]

一个用于 `esbuild` 的插件：将 `.html/.htm` 文件内容压缩后以 `text` loader 形式返回，便于在构建阶段内联或按文本消费 HTML。

## 安装

```bash
npm i @arylo/esbuild-plugin-html-minify-text
```

## 使用

```ts
import { build } from 'esbuild'
import HTMLMinifyTextPlugin from '@arylo/esbuild-plugin-html-minify-text'

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
  plugins: [HTMLMinifyTextPlugin()],
})
```

## 行为说明

- 匹配扩展名：`.html`、`.htm`
- 返回 loader：`text`
- 压缩引擎：`htmlnano`
- 当前内置配置：
  - `minifyCss: false`
  - `minifyJson: false`

## 要求

- `esbuild`：`^0.21.5`（peer dependency）

## 开发

```bash
npm run build
npm run lint
```

[LICENSE_URL]: https://img.shields.io/github/license/arylo/scripts.svg?logo=github&cacheSecond=7200
[LICENSE_HREF]: https://github.com/Arylo/scripts/blob/master/LICENSE
[AUTHOR_URL]: https://img.shields.io/badge/Author-AryloYeung-blue.svg?logo=github&cacheSecond=7200
[AUTHOR_HREF]: https://github.com/arylo
[PRS_URL]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[PRS_HREF]: https://github.com/arylo/scripts/pulls
