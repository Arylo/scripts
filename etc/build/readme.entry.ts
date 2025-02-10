import path from 'path'
import lodash from 'lodash'
import buildFS from "../../packages/buildFS"
import { globSync } from 'glob'
import { ROOT_PATH } from '../consts'
import parseScriptInfo from './utils/parseScriptInfo'

const CONSTANT = {
  GENERAL: {
    HEADER: `# Scripts for Arylo

[![GitHub license](https://img.shields.io/github/license/arylo/scripts.svg?style=flat-square&logo=github&cacheSecond=7200)](https://github.com/arylo/scripts/)

This project contains scripts that are useful for Arylo's daily tasks.`,
    FOOTER: `## License

[The MIT License.](https://github.com/Arylo/scripts/?tab=MIT-1-ov-file)`,
  },
  MONKEY: {
    HEADER: `## Monkey Scripts

|Script|Description|Install|
|--|--|--|
`,
    FOOTER: `[pass]: https://img.shields.io/badge/-pass-green.svg?&logoColor=000&style=for-the-badge&cacheSeconds=7200
[unknown]: https://img.shields.io/badge/-unknown-silver.svg?&logoColor=000&style=for-the-badge&cacheSeconds=7200`,
  },
  QINGLONG: {
    HEADER: `## Qinglong Scripts

|Script    |Description                               |
|--        |--                                        |
|groupVideo|Classification and storage for video files|
|moveVideo |Move video files to the target folder     |
`,
    FOOTER: '',
  },
}

function replaceAll (content: string, searchValue: string | RegExp, replaceValue: string) {
  while (true) {
    const newContent = content.replace(searchValue, replaceValue)
    if (newContent === content) break
    content = newContent
  }
  return content
}

function parseMonkeyMd (folderPath: string) {
  const infos = parseScriptInfo(folderPath)

  let content = buildFS.readFileSync(path.resolve(folderPath, 'README.md'))

  const installContent: string[] = []
  for (const info of infos) {
    const anchorKey = `${lodash.snakeCase(info.source)}_download_url`
    installContent.push(`[${lodash.startCase(info.source)}][${anchorKey}]`)
    content += `\n[${anchorKey}]: ${info.extraInfo.downloadURL}`
  }
  if (installContent.length) {
    content = content.replace(/(\n## Description\n)/, `\n## Install Addresses\n\n${installContent.join(' | ')}\n$1`)
  }

  content = content.replace(/(\n## Description\n)/, '$1\n![GitHub last commit][github-last-update]\n')
  content += `\n[github-last-update]: https://img.shields.io/github/last-commit/arylo/scripts/monkey?path=${infos[0].output.user}&style=flat&label=Last%20Update`

  let matches = content.match(/\[[^\]]+\]:/g) || []
  for (const m of matches) {
    const rawKey = m.replace(/:$/, '')
    const newKey = rawKey.replace(/^(\[)/, `$1${infos[0].scriptName}_`)
    content = replaceAll(content, rawKey, newKey)
  }

  matches = content.match(/(([^#]|^)#+ [^\n]+\n)/g) || []
  content = content.replace(/^(# [^\n]+\n)/, '$1\n[Top](#monkey-scripts)\n')

  for (const m of matches) {
    content = replaceAll(content, new RegExp(`(\n|^)${m}`), `$1${m.replace(/(# )/, '##$1')}`)
  }

  return content
}

const parseMonkeys = () => {
  const monkeyReadmePaths = globSync(path.resolve(ROOT_PATH, 'src/monkey/*/README.md'))
  let tableContent = CONSTANT.MONKEY.HEADER
  monkeyReadmePaths.forEach((p) => {
    const [info] = parseScriptInfo(path.dirname(p))

    const infos = [
      info.scriptName,
      buildFS.readJSONFileSync(info.bannerFilePath).description ?? '',
      `[Jump](#${lodash.kebabCase(buildFS.readFileSync(path.resolve(p)).match(/^# (.+?)\n/)?.[1])})`,
    ]
    tableContent += '|' +
      infos
        .map((c) => infos[1].startsWith('(Deprecated)') ? `~~${c}~~` : c)
        .map((c) => c.replace(/\|/g, '\\|'))
        .join('|') +
      '|\n'
  })

  const scriptMd = monkeyReadmePaths.map((p) => parseMonkeyMd(path.dirname(p))).join('\n\n')
  return [
    tableContent,
    scriptMd,
  ].join('\n\n')
}

buildFS.writeFileSync(
  path.resolve(ROOT_PATH, 'README.md'),
  [
    CONSTANT.GENERAL.HEADER,
    CONSTANT.MONKEY.HEADER,
    parseMonkeys(),
    CONSTANT.MONKEY.FOOTER,
    CONSTANT.QINGLONG.HEADER,
    CONSTANT.QINGLONG.FOOTER,
    CONSTANT.GENERAL.FOOTER,
  ].join('\n\n').replace(/\n{3,}/g, '\n\n') + '\n',
)
