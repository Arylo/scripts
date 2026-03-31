import path from 'path'
import buildFS from '@scripts/build-fs'
import parseScriptInfo, { ScriptInfo } from '@scripts/build-utils'
import logger from '@scripts/logger'
import lodash from 'lodash'
import { buildScript, exportLatestDeployInfo, stringifyBanner } from './monkey.utils'
import hasBannerFile from './utils/hasBannerFile'

// 从环境获取 githubRawPrefix，如果没有则使用默认值
const githubRawPrefix =
  process.env.GITHUB_RAW_PREFIX || 'https://raw.githubusercontent.com/Arylo/scripts/monkey'

export default async function (buildFolderPath: string) {
  const outPath = path.resolve(buildFolderPath, 'dist')
  const scriptInfos = [buildFolderPath]
    .filter((folderPath) => hasBannerFile(folderPath))
    .reduce<ScriptInfo[]>((list, folderPath) => {
      list.push(...parseScriptInfo(folderPath))
      return list
    }, [])

  for (const scriptInfo of scriptInfos) {
    await logger.inject(scriptInfo.scriptName, async () => {
      lodash.merge(scriptInfo, {
        deployInfo: await exportLatestDeployInfo(scriptInfo, githubRawPrefix),
      })
    })
  }

  await Promise.all(
    lodash.orderBy(scriptInfos, ['source'], ['asc']).map(async (scriptInfo) => {
      return await logger.inject([scriptInfo.scriptName, scriptInfo.source], async () => {
        logger.log(
          `Building ${path.relative(process.cwd(), scriptInfo.rootPath)} --outfile ${path.relative(process.cwd(), scriptInfo.outPath)} ...`,
        )
        const banner = stringifyBanner(scriptInfo.bannerFilePath, {
          version: scriptInfo.deployInfo.version,
          ...scriptInfo.extraInfo,
        })
        await buildScript(scriptInfo.entryFilePath, {
          banner: { js: banner },
          outfile: path.resolve(scriptInfo.outPath, scriptInfo.output.user),
        })
        buildFS.writeFileSync(path.resolve(scriptInfo.outPath, scriptInfo.output.meta), banner)
        buildFS.writeJSONFileSync(
          path.resolve(scriptInfo.outPath, scriptInfo.output.deployJson),
          scriptInfo.deployInfo,
        )
        logger.log(
          `Building ${path.relative(process.cwd(), scriptInfo.rootPath)} --outfile ${path.relative(process.cwd(), scriptInfo.outPath)} ... Done`,
        )
      })
    }),
  )
  for (const scriptInfo of lodash.groupBy(scriptInfos, 'source')['github'] || []) {
    for (const filepath of buildFS.ls(scriptInfo.outPath, { raw: true })) {
      buildFS.copyFile(filepath, path.resolve(outPath, path.basename(filepath)), { force: true })
    }
  }
}
