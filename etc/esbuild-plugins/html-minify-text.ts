import fs from 'fs'
import { Plugin } from 'esbuild'
import htmlnano from 'htmlnano'

export const HTMLMinifyTextPlugin: Plugin = {
  name: 'HTMLMinifyTextPlugin',
  setup (build) {
    build.onLoad({ filter: /\.html?$/ }, async (args) => {
      const fileContent = await fs.promises.readFile(args.path)
      const html = await htmlnano.process(fileContent.toString(), {
        minifyCss: false,
        minifyJson: false,
      })
      return { loader: 'text', contents: html.html }
    })
  }
}

export default HTMLMinifyTextPlugin
