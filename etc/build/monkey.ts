import path from 'path'
import fs from 'fs'
import * as esbuild from 'esbuild'
import { ROOT_PATH } from '../consts'

const domain = 'https://raw.githubusercontent.com'
const repo = 'Arylo/scripts/'
const branch = 'monkey'

const parseJsonPath = (filepath: string) => filepath.replace(/\.ts$/, '.json');
const paresBanner = (filepath: string) => {
  const pkg = require(path.resolve(ROOT_PATH, 'package.json'))
  const jsonPath = parseJsonPath(filepath)
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const filename = path.basename(jsonPath, '.json')
  console.log(filename)
  const metaData = Object
    .entries({
      ...jsonContent,
      author: pkg.author,
      downloadURL: `${domain}/${repo}${branch}/${filename}.js`,
      updateURL: `${domain}/${repo}${branch}/${filename}.meta.js`,
    })
    .reduce<string[]>((list, [key, value]) => {
      if (typeof value === 'string') {
        list.push(`@${key} ${value}`)
      } else if (Array.isArray(value)) {
        value.forEach((v) => typeof v === 'string' && list.push(`@${key} ${v}`))
      }
      return list
    }, [])
  const monkeyMetaData = ['==UserScript==', ...metaData, '==/UserScript==']
  return monkeyMetaData.map((metaData) => `// ${metaData}`).join('\n')
}

(() => {
  const srcPath = path.resolve(ROOT_PATH, 'src/monkey')
  const outPath = path.resolve(ROOT_PATH, 'dist/monkey')
  
  const filepaths = fs.readdirSync(srcPath)
    .map((filename) => path.resolve(srcPath, filename))
    .filter((filepath) => fs.statSync(filepath).isFile() && filepath.endsWith('.ts') && fs.statSync(parseJsonPath(filepath)).isFile())

  for (const filepath of filepaths) {
    console.log(`esbuild ${path.relative(srcPath, filepath)} --outdir=${outPath} ...`)
    const filename = path.basename(filepath, '.ts')
    const banner = paresBanner(filepath)
    esbuild.buildSync({
      entryPoints: [filepath],
      bundle: true,
      banner: { js: banner },
      outdir: outPath,
    })
    const metaPath = path.resolve(outPath, `${filename}.meta.js`)
    fs.writeFileSync(metaPath, banner, 'utf-8')
    console.log(`esbuild ${path.relative(srcPath, filepath)} --outdir=${outPath} ... Done!`)
  }
})()