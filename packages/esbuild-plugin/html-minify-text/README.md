# @arylo/esbuild-plugin-html-minify-text

[![MIT-License][LICENSE_URL]][LICENSE_HREF]
[![Author][AUTHOR_URL]][AUTHOR_HREF]
[![PRs Welcome][PRS_URL]][PRS_HREF]

A plugin for `esbuild` that minifies `.html/.htm` files and returns the result as a `text` loader payload.

中文文档请见 [README-zh.md](./README-zh.md)。

## Install

```bash
npm i @arylo/esbuild-plugin-html-minify-text
```

## Usage

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

## Behavior

- Matched extensions: `.html`, `.htm`
- Output loader: `text`
- Minifier engine: `htmlnano`
- Built-in options:
  - `minifyCss: false`
  - `minifyJson: false`

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
