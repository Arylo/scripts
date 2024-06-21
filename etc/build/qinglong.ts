import path from 'path'
import fs from 'fs'
import * as esbuild from 'esbuild'
import { ROOT_PATH } from '../consts'

const buildinDependencies = [
  'fs',
  'path',
  'os',
  'crypto',
  'process',
  'child_process',
]

;(() => {
  const srcPath = path.resolve(ROOT_PATH, 'src/qinglong')
  const outPath = path.resolve(ROOT_PATH, 'dist/qinglong')

  const filepaths = fs.readdirSync(srcPath)
    .map((filename) => path.resolve(srcPath, filename))
    .filter((filepath) => fs.statSync(filepath).isFile() && filepath.endsWith('.ts'))

  const dependencies = Object.keys(require(path.resolve(ROOT_PATH, 'package.json')).dependencies)

  for (const filepath of filepaths) {
    console.log(`esbuild ${path.relative(ROOT_PATH, filepath)} --outdir=${path.relative(ROOT_PATH, outPath)} ...`)
    esbuild.buildSync({
      entryPoints: [filepath],
      bundle: true,
      treeShaking: true,
      external: [...buildinDependencies, ...dependencies],
      outdir: outPath,
    })
    console.log(`esbuild ${path.relative(ROOT_PATH, filepath)} --outdir=${path.relative(ROOT_PATH, outPath)} ... Done!`)
  }
})()
