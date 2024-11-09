import fs from 'fs'
import { Plugin } from 'esbuild'
import { compileCss } from 'node-css-require';
import { GM_addStyle } from 'gm-polyfill'

export const GMModuleCSSPlugin: () => Plugin = () => ({
  name: 'GMModuleCSSPlugin',
  setup(build) {
    build.onLoad(
      { filter: /\.module\.css$/ },
      async (args) => {
        const fileContent = await fs.promises.readFile(args.path, 'utf-8')
        const res = await compileCss(fileContent, args.path);
        return {
          contents: `
            import { ${GM_addStyle.name} } from '${GM_addStyle.path}'
            const css = \`${res.css}\`;
            ${GM_addStyle.name}(css)
            ${res.js}
          `, loader: 'js'
        }
      },
    )
  }
})

export default GMModuleCSSPlugin
