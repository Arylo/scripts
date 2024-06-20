import fs from 'fs'
import { Plugin, transform } from 'esbuild'

export const CSSMinifyTextPlugin: () => Plugin = () => ({
  name: 'CSSMinifyTextPlugin',
  setup (build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const fileContent = await fs.promises.readFile(args.path)
      const css = await transform(fileContent, {
        loader: 'css',
        minify: true,
        charset: 'utf8',
        platform: 'neutral',
      })
      return { loader: 'text', contents: css.code }
    })
  }
})

export default CSSMinifyTextPlugin
