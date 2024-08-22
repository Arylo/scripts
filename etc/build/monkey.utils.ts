import fs from 'fs'
import path from 'path'
import os from 'os'
import * as esbuild from 'esbuild'
import md5file from 'md5-file'
import md5 from 'md5'
import yn from 'yn'
import download from 'download'
import logger from './logger'
import { bannerOrderMap, githubRawPrefix } from './monkey.const'
import { POLYFILL_PATH, ROOT_PATH } from '../consts'
import CSSMinifyTextPlugin from '../esbuild-plugins/css-minify-text'
import HTMLMinifyTextPlugin from '../esbuild-plugins/html-minify-text'

export const parseFilenames = (filepath: string) => {
  const filename = path.basename(filepath)
  return {
    // Raw
    raw: path.basename(filename),
    // Input
    bannerJson: 'banner.json',
    // Output
    name: 'index.ts',
    meta: `${filename}.meta.js`,
    user: `${filename}.user.js`,
    min: `${filename}.min.js`,
    deployJson: `${filename}.deploy.json`,
  }
}

export const parseJsonPath = (mainFilepath: string) => path.resolve(path.dirname(mainFilepath), parseFilenames(mainFilepath).bannerJson)

const pkgInfo = require(path.resolve(ROOT_PATH, 'package.json'))

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

export const exportInjectFiles = (mainFilepath: string) => {
  const { grant = [] } = parseBanner(mainFilepath)
  return (Array.isArray(grant) ? grant : [grant])
    .map((name) => path.resolve(POLYFILL_PATH, `${name}.ts`))
    .filter((filepath) => isFile(filepath))
}

export const parseBanner = (mainFilepath: string) =>{
  const jsonPath = parseJsonPath(mainFilepath)
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  return jsonContent
}

export const stringifyBanner = (mainFilepath: string, appendInfo = {}) => {
  const jsonContent = parseBanner(mainFilepath)
  const { user, meta } = parseFilenames(mainFilepath)

  const metaData = {
    ...jsonContent,
    version: undefined,
    ...appendInfo,
    author: pkgInfo.author,
    license: pkgInfo.license,
    homepage: pkgInfo.homepage,
    supportURL: pkgInfo.bugs.url,
    downloadURL: `${githubRawPrefix}/${user}`,
    updateURL: `${githubRawPrefix}/${meta}`,
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

export const exportLatestDeployInfo = async (filepath: string) => {
  const isCI = yn(process.env.CI, { default: false })
  const { name, min, bannerJson, deployJson } = parseFilenames(filepath)
  const sourcePath = path.resolve(filepath, name)
  await buildScript(sourcePath, {
    minify: true,
    outfile: path.resolve(os.tmpdir(), min),
    inject: exportInjectFiles(sourcePath),
  })
  const contentHash = md5file.sync(path.resolve(os.tmpdir(), min))
  const bannerHash = md5(stringifyBanner(path.resolve(filepath, bannerJson)))
  let version = 1
  const latestDeployUrl = `${githubRawPrefix}/${deployJson}`
  if (isCI)  {
    try {
      logger.info(`Download the latest deploy info: ${latestDeployUrl} ...`)
      await download(latestDeployUrl, os.tmpdir(), { filename: deployJson })
      logger.log(`Download the latest deploy info: ${latestDeployUrl} ... Done`)
      const downloadDeployJson = JSON.parse(fs.readFileSync(path.resolve(os.tmpdir(), deployJson), 'utf-8'))
      if (downloadDeployJson.contentHash !== contentHash || downloadDeployJson.bannerHash !== bannerHash) {
        version = Number(downloadDeployJson.version) + 1
        logger.info(`Version increased: ${downloadDeployJson.version} => ${version}`)
      } else {
        version = Number(downloadDeployJson.version)
      }
    } catch (e) {
      logger.error(`Download the latest deploy info: ${latestDeployUrl} ... Failed`)
      logger.info(`Version use: ${version}`)
    }
  } else {
    logger.info('Current Environment is not CI, use default version 1')
  }
  return {
    contentHash,
    bannerHash,
    version,
  }
}

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

export function isFile (filepath: string) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isFile()
}
