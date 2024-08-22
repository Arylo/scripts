import path from 'path'
import fs from 'fs'
import logger, { inject as loggerInject } from './logger'
import { ROOT_PATH } from '../consts'
import { buildScript, exportLatestDeployInfo, isFile, stringifyBanner, parseFilenames, exportInjectFiles } from './monkey.utils'

const srcPath = path.resolve(ROOT_PATH, 'src/monkey')
const outPath = path.resolve(ROOT_PATH, 'dist/monkey')

;(async () => {
  const filepaths = fs.readdirSync(srcPath)
    .map((filename) => path.resolve(srcPath, filename))
    .filter((filepath) => fs.statSync(filepath).isDirectory())
    .filter((filepath) => [
      isFile(path.resolve(filepath, parseFilenames(filepath).name)),
      isFile(path.resolve(filepath, parseFilenames(filepath).bannerJson)),
    ].some(Boolean))

  for (const filepath of filepaths) {
    const {
      raw,
      meta,
      user,
      deployJson
    } = parseFilenames(filepath)
    await loggerInject(raw, async () => {
      const sourcePath = path.resolve(filepath, parseFilenames(filepath).name)
      const targetPath = path.resolve(outPath, user)
      logger.log(`Building ${path.relative(ROOT_PATH, sourcePath)} --outfile ${path.relative(ROOT_PATH, targetPath)} ...`)
      const deployInfo = await exportLatestDeployInfo(filepath)
      const banner = stringifyBanner(sourcePath, { version: deployInfo.version })
      await buildScript(sourcePath, {
        banner: { js: banner },
        outfile: targetPath,
        inject: exportInjectFiles(sourcePath),
      })
      const metaPath = path.resolve(outPath, meta)
      fs.writeFileSync(path.resolve(outPath, deployJson), JSON.stringify(deployInfo, null, 2), 'utf-8')
      fs.writeFileSync(metaPath, banner, 'utf-8')
      logger.log(`Building ${path.relative(ROOT_PATH, sourcePath)} --outfile=${path.relative(ROOT_PATH, targetPath)} ... Done!`)
    })
  }
})()
