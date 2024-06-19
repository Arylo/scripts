import fs from 'fs'
import path from 'path'
import os from 'os'
import * as esbuild from 'esbuild'
import md5file from 'md5-file'
import md5 from 'md5'
import download from 'download'
import { bannerOrderMap, githubRawPrefix } from './monkey.const'
import { ROOT_PATH } from '../consts'

export const parseFilenames = (filepath: string) => {
  const filename = path.basename(filepath, path.extname(filepath))
  return {
    raw: path.basename(filename),
    name: filename,
    meta: `${filename}.meta.js`,
    user: `${filename}.user.js`,
    min: `${filename}.min.js`,
    bannerJson: `${filename}.json`,
    deployJson: `${filename}.deploy.json`,
  }
}

export const parseJsonPath = (filepath: string) => path.resolve(path.dirname(filepath), parseFilenames(filepath).bannerJson)

const pkgInfo = require(path.resolve(ROOT_PATH, 'package.json'))

const parseMetaItem = (key: string, value: any) => {
  if (typeof value === 'string') {
    return `@${key} ${value}`
  } else if (typeof value === 'number') {
    return `@${key} ${value}`
  }
}

export const paresBanner = (filepath: string, appendInfo = {}) => {
  const jsonPath = parseJsonPath(filepath)
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const { user, meta } = parseFilenames(filepath)

  const metaData = {
    ...jsonContent,
    version: undefined,
    ...appendInfo,
    author: pkgInfo.author,
    downloadURL: `${githubRawPrefix}/${user}`,
    updateURL: `${githubRawPrefix}/${meta}`,
  }
  const content = Object
    .entries(metaData)
    .sort(([key1], [key2]) => {
      const orderHead = bannerOrderMap.head
      const orderTail = bannerOrderMap.tail
      const key1Order = [...orderHead, ...orderTail].indexOf(key1)
      const key2Order = [...orderHead, ...orderTail].indexOf(key2)

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
  const { min, deployJson } = parseFilenames(filepath)
  buildScript(filepath, {
    minify: true,
    outfile: path.resolve(os.tmpdir(), min),
  })
  const contentHash = md5file.sync(path.resolve(os.tmpdir(), min))
  const bannerHash = md5(paresBanner(filepath))
  let version = 1
  const latestDeployUrl = `${githubRawPrefix}/${deployJson}`
  try {
    await download(latestDeployUrl, os.tmpdir(), { filename: deployJson })
    const downloadDeployJson = JSON.parse(fs.readFileSync(path.resolve(os.tmpdir(), deployJson), 'utf-8'))
    console.log(downloadDeployJson)
    if (downloadDeployJson.contentHash !== contentHash && downloadDeployJson.bannerHash !== bannerHash) {
      version = Number(downloadDeployJson.version) + 1
    } else {
      version = Number(downloadDeployJson.version)
      console.log(downloadDeployJson)
    }
  } catch (e) {}
  return {
    contentHash,
    bannerHash,
    version,
  }
}

export const buildScript = (filepath: string, extraConfig: esbuild.BuildOptions= {}) => {
  return esbuild.buildSync({
    entryPoints: [filepath],
    bundle: true,
    loader: { '.css': 'text' },
    ...extraConfig,
  })
}
