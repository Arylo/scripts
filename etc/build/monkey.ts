import path from 'path'
import lodash from 'lodash'
import { ROOT_PATH } from '../consts'
import { buildScript, exportLatestDeployInfo, stringifyBanner, exportInjectFiles } from './monkey.utils'
import hasBannerFile from './utils/hasBannerFile'
import parseScriptInfo, { ScriptInfo } from './utils/parseScriptInfo'
import buildFS, { LS_TYPE } from '../../packages/buildFS'
import logger from '../../packages/logger'

const srcPath = path.resolve(ROOT_PATH, 'src/monkey')
const outPath = path.resolve(ROOT_PATH, 'dist/monkey')

const matchValueIndex = process.argv.findIndex((v) => ['--match', '-m'].includes(v))
let matchValue!: string
if (matchValueIndex > 0) {
  matchValue = process.argv[matchValueIndex + 1]
}

;(async () => {
  const scriptInfos = buildFS.ls(srcPath, { types: [LS_TYPE.FOLDER], raw: true })
    .filter((folderPath) => hasBannerFile(folderPath))
    .filter((folderPath) => !matchValue || path.basename(folderPath).includes(matchValue))
    .reduce<ScriptInfo[]>((list, folderPath) => {
      list.push(...parseScriptInfo(folderPath))
      return list
    }, [])

  for (const scriptInfo of scriptInfos) {
    await logger.inject(scriptInfo.scriptName, async () => {
      lodash.merge(scriptInfo, { deployInfo: await exportLatestDeployInfo(scriptInfo) })
    })
  }

  for (const scriptInfo of lodash.orderBy(scriptInfos, ['source'], ['asc'])) {
    await logger.inject([scriptInfo.source, scriptInfo.scriptName], async () => {
      logger.log(`Building ${path.relative(ROOT_PATH, scriptInfo.rootPath)} --outfile ${path.relative(ROOT_PATH, scriptInfo.outPath)} ...`)
      const banner = stringifyBanner(scriptInfo.bannerFilePath, {
        version: scriptInfo.deployInfo.version,
        ...scriptInfo.extraInfo,
      })
      await buildScript(scriptInfo.entryFilePath, {
        banner: { js: banner },
        outfile: path.resolve(scriptInfo.outPath, scriptInfo.output.user),
        inject: exportInjectFiles(scriptInfo.bannerFilePath),
      })
      buildFS.writeFileSync(path.resolve(scriptInfo.outPath, scriptInfo.output.meta), banner)
      buildFS.writeJSONFileSync(path.resolve(scriptInfo.outPath, scriptInfo.output.deployJson), scriptInfo.deployInfo)
      logger.log(`Building ${path.relative(ROOT_PATH, scriptInfo.rootPath)} --outfile ${path.relative(ROOT_PATH, scriptInfo.outPath)} ... Done`)
    })
  }
  for (const scriptInfo of lodash.groupBy(scriptInfos, 'source')['github']) {
    for (const filepath of buildFS.ls(scriptInfo.outPath, { raw: true })) {
      buildFS.copyFile(filepath, path.resolve(outPath, path.basename(filepath)), { force: true })
    }
  }
})()
