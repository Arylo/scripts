# @arylo/esbuild-plugin-css-minify-text

[![MIT-License][LICENSE_URL]][LICENSE_HREF]
[![Author][AUTHOR_URL]][AUTHOR_HREF]
[![PRs Welcome][PRS_URL]][PRS_HREF]

一个用于 `esbuild` 的插件：读取 `.css` 文件并通过 `esbuild.transform` 进行压缩（可关闭），最终以 `text` loader 形式返回。

## 安装

```bash
npm i @arylo/esbuild-plugin-css-minify-text
```

## 使用

```ts
import { build } from 'esbuild'
import CSSMinifyTextPlugin from '@arylo/esbuild-plugin-css-minify-text'

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
  plugins: [CSSMinifyTextPlugin()],
})
```

## API

### `CSSMinifyTextPlugin(options?)`

`options`:

- `enableMinify?: boolean`
  - 默认值：`true`
  - 设置为 `false` 时仅转换，不做压缩

示例：

```ts
CSSMinifyTextPlugin({ enableMinify: false })
```

## 行为说明

- 匹配扩展名：`.css`
- 返回 loader：`text`
- 内部 transform 参数：
  - `loader: 'css'`
  - `charset: 'utf8'`
  - `platform: 'neutral'`

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
