import path from 'path'
import lodash from 'lodash'
import TOML from '@iarna/toml'
import { ROOT_PATH } from '../../consts'
import { githubRawPrefix } from '../monkey.const'
import buildFS from '../../../packages/buildFS'

const pkgInfo = buildFS.readJSONFileSync(path.resolve(ROOT_PATH, 'package.json'))

const cacheMap: Record<string, Record<string, object | string>> = {}

export default function parseScriptInfo(scriptRootPath: string) {
  const scriptName = path.basename(scriptRootPath)
  const obj = {
    rootPath: scriptRootPath,
    bannerFilePath: path.resolve(scriptRootPath, 'banner.json'),
    entryFilePath: path.resolve(scriptRootPath, 'index.ts'),
    scriptName,
    output: {
      meta: `${scriptName}.meta.js`,
      user: `${scriptName}.user.js`,
      deployJson: `${scriptName}.deploy.json`,
    },
    outPath: path.resolve(ROOT_PATH, 'dist/monkey'),
    extraInfo: {},
    deployInfo: {
      version: 1,
      contentHash: undefined,
      bannerHash: undefined,
    },
  }
  const configPath = path.resolve(scriptRootPath, 'config.toml')
  let configContent: Record<string, object | string> = cacheMap[scriptName] ?? {
    github: {
      downloadURL: `${githubRawPrefix}/${obj.output.user}`,
      updateURL: `${githubRawPrefix}/${obj.output.meta}`,
      homepage: pkgInfo.homepage,
      supportURL: pkgInfo.bugs.url,
    },
  }
  if (!cacheMap[scriptName] && buildFS.isFile(configPath)) {
    try {
      cacheMap[scriptName] = configContent = lodash.merge(configContent, TOML.parse(buildFS.readFileSync(configPath)))
    } catch (e) {}
  }
  const commonExtraInfo = Object.keys(configContent)
    .filter((key) => typeof configContent[key] !== 'object')
    .reduce<Record<string, string>>((newObj, key) => {
      newObj[key] = configContent[key] as string
      return newObj
    }, {})
  return Object.keys(configContent)
    .filter((key) => typeof configContent[key] === 'object')
    .map((sourceKey) => {
      return lodash.merge({}, obj, {
        source: sourceKey,
        extraInfo: {
          ...commonExtraInfo,
          ...configContent[sourceKey] as object,
        },
        outPath: path.resolve(obj.outPath, sourceKey),
      })
    })
}

export type ScriptInfo = ReturnType<typeof parseScriptInfo>[number]
