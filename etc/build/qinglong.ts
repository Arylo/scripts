import path from 'path'
import fs from 'fs'
import * as esbuild from 'esbuild'
import { ROOT_PATH } from '../consts'
import buildFS from '../../packages/buildFS'
import logger from '../../packages/logger'

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
    .filter((filepath) => buildFS.isFile(filepath) && filepath.endsWith('.ts'))

  const dependencies = Object.keys(require(path.resolve(ROOT_PATH, 'package.json')).dependencies)

  for (const filepath of filepaths) {
    logger.inject(path.basename(filepath), () => {
      logger.info(`esbuild ${path.relative(ROOT_PATH, filepath)} --outdir ${path.relative(ROOT_PATH, outPath)} ...`)
      esbuild.buildSync({
        entryPoints: [filepath],
        bundle: true,
        treeShaking: true,
        external: [...buildinDependencies, ...dependencies],
        outdir: outPath,
      })
      logger.info(`esbuild ${path.relative(ROOT_PATH, filepath)} --outdir=${path.relative(ROOT_PATH, outPath)} ... Done!`)
    })
  }
})()
