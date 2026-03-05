# @arylo/esbuild-plugin-css-minify-text

[![MIT-License][LICENSE_URL]][LICENSE_HREF]
[![Author][AUTHOR_URL]][AUTHOR_HREF]
[![PRs Welcome][PRS_URL]][PRS_HREF]

A plugin for `esbuild` that reads `.css` files, minifies them with `esbuild.transform` (optional), and returns the result as a `text` loader payload.

中文文档请见 [README-zh.md](./README-zh.md)。

## Install

```bash
npm i @arylo/esbuild-plugin-css-minify-text
```

## Usage

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
  - Default: `true`
  - Set to `false` to transform without minification

Example:

```ts
CSSMinifyTextPlugin({ enableMinify: false })
```

## Behavior

- Matched extension: `.css`
- Output loader: `text`
- Internal transform options:
  - `loader: 'css'`
  - `charset: 'utf8'`
  - `platform: 'neutral'`

## Requirements

- `esbuild`: `^0.21.5` (peer dependency)

## Development

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
