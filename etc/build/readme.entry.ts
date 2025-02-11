import path from 'path'
import lodash from 'lodash'
import buildFS from "../../packages/buildFS"
import { globSync } from 'glob'
import { ROOT_PATH } from '../consts'
import parseScriptInfo from './utils/parseScriptInfo'
import * as MdGenerator from '../../packages/MdGenerator'

const CONSTANT = {
  GENERAL: {
    HEADER: MdGenerator.genTemplate((utils) => {
      utils.h1('Scripts for Arylo')
      utils.hyperlink(
        MdGenerator.image('https://img.shields.io/github/license/arylo/scripts.svg?style=flat-square&logo=github&cacheSecond=7200', 'GitHub license'),
        'https://github.com/arylo/scripts/'
      )
      utils.emptyLine()
      utils.text(`This project contains scripts that are useful for Arylo's daily tasks.`)
    }),
    FOOTER: MdGenerator.genTemplate((utils) => {
      utils.h2('License')
      utils.hyperlink('The MIT License.', 'https://github.com/Arylo/scripts/?tab=MIT-1-ov-file')
    }),
  },
  MONKEY: {
    HEADER: MdGenerator.genTemplate((utils) => utils.h2('Monkey Scripts')),
    FOOTER: MdGenerator.genTemplate((utils) => {
      utils.anchor('pass', 'https://img.shields.io/badge/-pass-green.svg?&logoColor=000&style=for-the-badge&cacheSeconds=7200')
      utils.anchor('unknown', 'https://img.shields.io/badge/-unknown-silver.svg?&logoColor=000&style=for-the-badge&cacheSeconds=7200')
    }),
  },
  QINGLONG: {
    HEADER: MdGenerator.genTemplate((utils) => {
      utils.h2('Qinglong Scripts')
      utils.table()
        .header([
          { title: 'Script', key: 'name' },
          { title: 'Description', key: 'description' },
        ])
        .body({ name: 'groupVideo', description: 'Classification and storage for video files' })
        .body({ name: 'moveVideo', description: 'Move video files to the target folder' })
        .end()
    }),
    FOOTER: '',
  },
}

function parseMonkeyMd (folderPath: string) {
  const infos = parseScriptInfo(folderPath)

  let content = buildFS.readFileSync(path.resolve(folderPath, 'README.md'))

  content = MdGenerator.readTemplate(content, (utils) => {
    const installContent = infos.map((info) => {
      const anchorKey = `${lodash.snakeCase(info.source)}_download_url`
      utils.anchor(anchorKey, info.extraInfo.downloadURL)
      return MdGenerator.hyperlinkWithKey(lodash.startCase(info.source), anchorKey)
    }).join(' | ')
    if (installContent.length) {
      utils.modify((currentContent) => {
        const contentList = currentContent.split(/\n/)
        const descriptionIndex = contentList.findIndex((v) => v.trimEnd() === (MdGenerator.h2('Description')))
        descriptionIndex > -1 && contentList.splice(descriptionIndex, 0, ...[
          MdGenerator.enter(),
          MdGenerator.h2('Install Addresses'),
          MdGenerator.enter(),
          installContent,
          MdGenerator.enter()
        ])
        return contentList.join('\n')
      })
      utils.modify((currentContent) => {
        const contentList = currentContent.split(/\n/)
        const descriptionIndex = contentList.findIndex((v) => v.trimEnd() === (MdGenerator.h2('Description')))
        const anchorKey = 'github-last-update'
        const anchorValue = `https://img.shields.io/github/last-commit/arylo/scripts/monkey?path=${infos[0].output.user}&style=flat&label=Last%20Update`
        contentList.splice(descriptionIndex + 1, 0, ...[
          MdGenerator.enter(),
          MdGenerator.imageByKey(anchorKey, 'GitHub last commit'),
          MdGenerator.enter(),
        ])
        utils.anchor(anchorKey, anchorValue)
        return contentList.join('\n')
      })
    }
  })

  content = MdGenerator.readTemplate(content, (utils) => {
    utils.modify((currentContent) => {
      const keys: string[] = []
      let contentList = currentContent.split(/\n/)
      contentList.forEach((c) => {
        const matches = c.match(/^\[([^\]]+)\]:/)
        if (matches) keys.push(matches[1])
      })
      const keyRegExps = keys.map((k) => new RegExp(`(\\[([^\\]])+\\])\\[${k}\\]`, 'g'))
      const anchorRegExps = keys.map((k) => new RegExp(`\\[${k}\\]:`, 'g'))
      contentList = contentList.map((c) => {
        keys.forEach((k, index) => {
          c = c.replace(keyRegExps[index], `$1[${infos[0].scriptName}_${k}]`)
          c = c.replace(anchorRegExps[index], `[${infos[0].scriptName}_${k}]:`)
        })
        return c
      })
      return contentList.join('\n')
    })
  })

  content = MdGenerator.readTemplate(content, (utils) => {
    utils.modify((currentContent) => {
      const contentList = currentContent.split(/\n/)
      contentList.splice(1, 0, ...[
        MdGenerator.enter(),
        MdGenerator.hyperlink('Top', `#${lodash.kebabCase(CONSTANT.MONKEY.HEADER.split(/\n/)[0].replace(/^[\s#]+/, ''))}`),
        MdGenerator.enter(),
      ])
      return contentList.join('\n')
    })
  })

  content = MdGenerator.readTemplate(content, (utils) => {
    utils.modify((currentContent) => {
      const contentList = currentContent.split(/\n/)
      return contentList.map((c) => c.startsWith('#') ? `##${c}` : c).join('\n')
    })
  })

  return content
}

const parseMonkeys = () => {
  const monkeyReadmePaths = globSync(path.resolve(ROOT_PATH, 'src/monkey/*/README.md'))
  const tableContent = MdGenerator.genTemplate((utils) => {
    const tableFns = utils.table()
    tableFns.header([
      { title: 'Script', key: 'title' },
      { title: 'Description', key: 'description' },
      { title: 'Install', key: 'install' },
    ])
    monkeyReadmePaths.forEach((p) => {
      const [info] = parseScriptInfo(path.dirname(p))

      const infos: string[] = [
        info.scriptName,
        buildFS.readJSONFileSync(info.bannerFilePath).description ?? '',
        MdGenerator.hyperlink('Jump', `#${lodash.kebabCase(buildFS.readFileSync(path.resolve(p)).match(/^# (.+?)\n/)?.[1])}`),
      ]
        .map((c, _, list) => list[1].startsWith('(Deprecated)') ? `~~${c}~~` : c)
        .map((c) => c.replace(/\|/g, '\\|'))
      tableFns.body({
        title: infos[0],
        description: infos[1],
        install: infos[2],
      })
    })
    tableFns.end()
  })

  const scriptMd = monkeyReadmePaths.map((p) => parseMonkeyMd(path.dirname(p))).join('\n\n')
  return [
    tableContent,
    scriptMd,
  ].join('\n\n')
}

buildFS.writeFileSync(
  path.resolve(ROOT_PATH, 'README.md'),
  MdGenerator.genTemplate((utils) => {
    utils.text(CONSTANT.GENERAL.HEADER)
    utils.text(CONSTANT.MONKEY.HEADER)
    utils.text(parseMonkeys())
    utils.text(CONSTANT.MONKEY.FOOTER)
    utils.text(CONSTANT.QINGLONG.HEADER)
    utils.text(CONSTANT.QINGLONG.FOOTER)
    utils.text(CONSTANT.GENERAL.FOOTER)
  }).replace(/\n\n$/, '\n'),
)
