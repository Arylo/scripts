import fs from 'fs'
import path from 'path'
import buildFS from '@scripts/build-fs'
import logger from '@scripts/logger'
import * as esbuild from 'esbuild'

// oxfmt-ignore
const buildinDependencies = [
  'fs',
  'path',
  'os',
  'crypto',
  'process',
  'child_process',
]

const projectRootPath = process.cwd()

;(() => {
  const srcPath = path.resolve(projectRootPath, 'src')
  const outPath = path.resolve(projectRootPath, 'dist')

  const filepaths = fs
    .readdirSync(srcPath)
    .map((filename) => path.resolve(srcPath, filename))
    .filter((filepath) => buildFS.isFile(filepath) && filepath.endsWith('.ts'))

  const dependencies = Object.keys(
    require(path.resolve(projectRootPath, 'package.json')).dependencies ?? {},
  )

  for (const filepath of filepaths) {
    logger.inject(path.basename(filepath), () => {
      logger.info(
        `esbuild ${path.relative(projectRootPath, filepath)} --outdir ${path.relative(projectRootPath, outPath)} ...`,
      )
      esbuild.buildSync({
        entryPoints: [filepath],
        bundle: true,
        treeShaking: true,
        external: [...buildinDependencies, ...dependencies],
        outdir: outPath,
      })
      logger.info(
        `esbuild ${path.relative(projectRootPath, filepath)} --outdir=${path.relative(projectRootPath, outPath)} ... Done!`,
      )
    })
  }
})()
