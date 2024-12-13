import path from 'path'
import lodash from 'lodash'
import TOML from '@iarna/toml'
import { ROOT_PATH } from '../../consts'
import { githubRawPrefix } from '../monkey.const'
import buildFS from '../../../packages/buildFS'

const pkgInfo = buildFS.readJSONFileSync(path.resolve(ROOT_PATH, 'package.json'))

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
  let configContent: Record<string, object> = {
    github: {
      downloadURL: `${githubRawPrefix}/${obj.output.user}`,
      updateURL: `${githubRawPrefix}/${obj.output.meta}`,
      homepage: pkgInfo.homepage,
      supportURL: pkgInfo.bugs.url,
    },
  }
  if (buildFS.isFile(configPath)) {
    try {
      configContent = lodash.merge(configContent, TOML.parse(buildFS.readFileSync(configPath)))
    } catch (e) {}
  }
  return Object.keys(configContent).map((sourceKey) => {
    return lodash.merge({}, obj, {
      source: sourceKey,
      extraInfo: configContent[sourceKey],
      outPath: path.resolve(obj.outPath, sourceKey),
    })
  })
}

export type ScriptInfo = ReturnType<typeof parseScriptInfo>[number]
