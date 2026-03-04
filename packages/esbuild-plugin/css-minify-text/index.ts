import fs from 'fs'
import { Plugin, transform } from 'esbuild'

interface CSSMinifyTextPluginOptions {
  enableMinify?: boolean
}

function CSSMinifyTextPlugin(options?: CSSMinifyTextPluginOptions): Plugin {
  const { enableMinify = true } = options ?? {}
  return {
    name: 'CSSMinifyTextPlugin',
    setup(build) {
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const fileContent = await fs.promises.readFile(args.path, 'utf-8')
        const css = await transform(fileContent, {
          loader: 'css',
          minify: enableMinify,
          charset: 'utf8',
          platform: 'neutral',
        })
        return { loader: 'text', contents: css.code }
      })
    },
  }
}

export default CSSMinifyTextPlugin
