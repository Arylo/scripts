import path from 'path'
import * as esbuild from 'esbuild'
import md5file from 'md5-file'
import md5 from 'md5'
import yn from 'yn'
import download from 'download'
import { bannerOrderMap, githubRawPrefix } from './monkey.const'
import { POLYFILL_PATH, ROOT_PATH } from '../consts'
import CSSMinifyTextPlugin from '../esbuild-plugins/css-minify-text'
import HTMLMinifyTextPlugin from '../esbuild-plugins/html-minify-text'
import { ScriptInfo } from './utils/parseScriptInfo'
import buildFS from '../../packages/buildFS'
import logger from '../../packages/logger'

const parseMetaItem = (key: string, value: any) => {
  if (typeof value === 'string') {
    return `@${key} ${value}`
  } else if (typeof value === 'number') {
    return `@${key} ${value}`
  }
}

const findIndex = (val: string, rules: Array<string|RegExp> = []) => {
  return rules.findIndex((rule) => {
    if (rule instanceof RegExp) {
      return rule.test(val)
    } else {
      return rule === val
    }
  })
}

export const parseBanner = (bannerFilePath: string) =>{
  const jsonContent = buildFS.readJSONFileSync(bannerFilePath)
  return jsonContent
}

export const stringifyBanner = (bannerFilepath: string, appendInfo = {}) => {
  const isCI = yn(process.env.CI, { default: false })
  const jsonContent = parseBanner(bannerFilepath)
  const pkgInfo = buildFS.readJSONFileSync(path.resolve(ROOT_PATH, 'package.json'))

  const metaData = {
    ...jsonContent,
    author: pkgInfo.author,
    version: undefined,
    ...appendInfo,
    license: pkgInfo.license,
  }
  if (!isCI) {
    Object.keys(metaData)
      .filter((key) => /^name(:.+)?$/.test(key))
      .forEach((key) => (metaData[key] = `[Dev] ${metaData[key]}`))
  }
  const content = Object
    .entries(metaData)
    .sort(([key1], [key2]) => {
      const orderHead = bannerOrderMap.head
      const orderTail = bannerOrderMap.tail
      const key1Order = findIndex(key1, [...orderHead, ...orderTail])
      const key2Order = findIndex(key2, [...orderHead, ...orderTail])

      let result = -1
      if (key1Order !== -1 && key2Order !== -1) {
        result = key1Order - key2Order
      } else if (key1Order !== -1) {
        result = key1Order >= orderHead.length ? 1 : -1
      } else if (key2Order !== -1) {
        result = key2Order >= orderHead.length ? -1 : 1
      } else {
        result = key1.localeCompare(key2)
      }
      return result
    })
    .reduce<string[]>((list, [key, value]) => {
      const values = Array.isArray(value) ? value : [value]
      values.forEach((v) => {
        const item = parseMetaItem(key, v)
        item && list.push(item)
      })
      return list
    }, [])
  const bannerContent = ['==UserScript==', ...content, '==/UserScript==']
  return bannerContent.map((content) => `// ${content}`).join('\n')
}

export const exportLatestDeployInfo = (() => {
  const isCI = yn(process.env.CI, { default: false })
  const cacheMap: Record<string, { version: number, contentHash: string, bannerHash: string }> = {}
  return async (scriptInfo: ScriptInfo) => {
    if (cacheMap[scriptInfo.scriptName]) return cacheMap[scriptInfo.scriptName]
    let version = 1
    let contentHash = ''
    let bannerHash = ''
    if (isCI) {
      // #region content hash
      const tmpScriptPath = buildFS.createTempPath()
      await buildScript(scriptInfo.entryFilePath, {
        minify: true,
        outfile: tmpScriptPath,
      })
      contentHash = md5file.sync(tmpScriptPath)
      // #endregion content hash
      // #region banner hash
      bannerHash = md5(stringifyBanner(scriptInfo.bannerFilePath))
      // #endregion banner hash
      // #region version
      const latestDeployUrl = `${githubRawPrefix}/${scriptInfo.output.deployJson}`
      try {
        logger.info(`Download the latest deploy info: ${latestDeployUrl} ...`)
        const tmpJsonPath = buildFS.createTempPath('json')
        await download(latestDeployUrl, path.dirname(tmpJsonPath), { filename: path.basename(tmpJsonPath) })
        logger.info(`Download the latest deploy info: ${latestDeployUrl} ... Done`)
        const downloadDeployJson = buildFS.readJSONFileSync(tmpJsonPath)

        const isDiffContent = downloadDeployJson.contentHash !== contentHash
        const isDiffBanner = downloadDeployJson.bannerHash !== bannerHash

        logger.info('ContentHash:', `[current:${contentHash}]`, `${isDiffContent ? '!' : '='}=`, `[remote:${downloadDeployJson.contentHash}]`)
        logger.info('BannerHash: ', `[current:${bannerHash}]`, `${isDiffBanner ? '!' : '='}=`, `[remote:${downloadDeployJson.bannerHash}]`)

        if (isDiffBanner || isDiffContent) {
          version = Number(downloadDeployJson.version) + 1
          logger.info(`Version increased: ${downloadDeployJson.version} => ${version}`)
        } else {
          version = Number(downloadDeployJson.version)
        }
      } catch (e) {
        logger.error(`Download the latest deploy info: ${latestDeployUrl} ... Failed`)
        logger.info(`Version use: ${version}`)
      }
      // #endregion version
    } else {
      logger.warn('Current Environment is not CI, use default version 1')
    }
    cacheMap[scriptInfo.scriptName] = {
      version,
      contentHash,
      bannerHash,
    }
    return cacheMap[scriptInfo.scriptName]
  }
})()

export const buildScript = (filepath: string, extraConfig: esbuild.BuildOptions= {}) => {
  const isCI = yn(process.env.CI, { default: false })
  return esbuild.build({
    entryPoints: [filepath],
    bundle: true,
    treeShaking: true,
    ...extraConfig,
    ...(isCI ? {
      plugins: [
        CSSMinifyTextPlugin(),
        HTMLMinifyTextPlugin(),
      ],
    } : {
      loader: {
        '.css': 'text',
        '.html': 'text',
      },
    }),
  })
}
