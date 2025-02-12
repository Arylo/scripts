import lodash from 'lodash'
import * as MdTools from './MdTools'
export { MdTools }

interface LevelOptions {
  level: number,
}

function getOption<O extends Record<string, any>, K extends keyof O>(options: O, key: K, defaultValue: O[K]): O[K];
function getOption<O extends Record<string, any>, K extends keyof O>(options: O, key: K, defaultValue?: O[K]) {
  return options[key] ?? defaultValue
}

function getLevelFromOptions(options: Partial<LevelOptions> = {}) {
  const { level = 1 } = options
  return level
}

type TextOptions = Partial<LevelOptions>
type ListItemOptions = Partial<LevelOptions>
type TaskItemOptions = Partial<LevelOptions & { selected: boolean }>
type TableOptions = Partial<LevelOptions>
type HyperlinkOptions = Partial<LevelOptions & { anchorKey: string }>
type ImageOptions = Partial<LevelOptions & { anchorKey: string, alt: string }>

class Template {
  protected templateContent: string
  protected anchorMap: Record<string, string> = {}
  private headerNextUtils: { text: Template['text'], listItem: Template['listItem'], taskItem: Template['taskItem'], image: Template['image'], hyperlink: Template['hyperlink'] }
  private contentNextUtils: Template['headerNextUtils'] & { end: Template['emptyLine'] }
  constructor(text: string) {
    this.templateContent = text
    this.headerNextUtils = {
      text: this.text.bind(this),
      image: this.image.bind(this),
      hyperlink: this.hyperlink.bind(this),
      listItem: this.listItem.bind(this),
      taskItem: this.taskItem.bind(this),
    }
    this.contentNextUtils = {
      ...this.headerNextUtils,
      end: this.emptyLine.bind(this),
    }
  }

  public h1(text: string) {
    this.text(MdTools.h1(text))
    this.emptyLine()
    return this.headerNextUtils
  }
  public h2(text: string) {
    this.text(MdTools.h2(text))
    this.emptyLine()
    return this.headerNextUtils
  }
  public h3(text: string) {
    this.text(MdTools.h3(text))
    this.emptyLine()
    return this.headerNextUtils
  }
  public h4(text: string) {
    this.text(MdTools.h4(text))
    this.emptyLine()
    return this.headerNextUtils
  }
  public h5(text: string) {
    this.text(MdTools.h5(text))
    this.emptyLine()
    return this.headerNextUtils
  }
  public [Symbol.toStringTag]() {
    return [
      this.templateContent,
      this.templateContent && !/\n$/.test(this.templateContent) && MdTools.enter(),
      Object.keys(this.anchorMap).length && MdTools.enter(),
      Object.entries(this.anchorMap).map(([key, value]) => MdTools.anchor(key, value)).join(MdTools.enter()),
      Object.keys(this.anchorMap).length && MdTools.enter(),
    ].filter(Boolean).join('').replace(/\n(\s*\n){2,}/g, '\n\n')
  }

  public text(content = '', opts?: TextOptions) {
    this.templateContent += MdTools.indent(getLevelFromOptions(opts), `${MdTools.text(content)}${MdTools.enter()}`)
    return this.contentNextUtils
  }
  public listItem(text = '', opts?: ListItemOptions) {
    return this.text(MdTools.listItem(text), { level: getLevelFromOptions(opts) })
  }
  public taskItem(text = '', opts?: TaskItemOptions) {
    return this.listItem(MdTools.taskItem(text, { selected: getOption(opts || {}, 'selected', false) }), { level: getLevelFromOptions(opts) })
  }
  public hyperlink(text: string, link: string, opts?: HyperlinkOptions) {
    let content!: string
    const anchorKey = getOption(opts || {}, 'anchorKey', '')
    if (typeof anchorKey === 'string' && anchorKey.length) {
      MdTools.anchor(anchorKey, link)
      content = MdTools.hyperlinkWithKey(text, anchorKey)
    } else {
      content = MdTools.hyperlink(text, link)
    }
    return this.text(content, { level: getLevelFromOptions(opts) })
  }
  public image(url: string, opts?: ImageOptions) {
    let content!: string
    const anchorKey = getOption(opts || {}, 'anchorKey', '')
    const alt = getOption(opts || {}, 'alt', '') as string
    if (typeof anchorKey === 'string' && anchorKey.length) {
      this.anchor(anchorKey, url)
      content = MdTools.imageByKey(alt, anchorKey)
    } else {
      content = MdTools.image(alt, url)
    }
    return this.text(content, { level: getLevelFromOptions(opts) })
  }

  public table(opts?: TableOptions) {
    const tableMap: { header: { key: string, title: string }[], body: Record<string, string | number>[]} = { header: [], body: [] }
    const actionMap = {
      header: (row: { key: string, title: string }[]) => {
        row.forEach(({ key, title }) => {
          tableMap.header.push({ key, title })
        })
        return actionMap
      },
      body: (row: Record<string, string | number>) => {
        tableMap.body.push(row)
        return actionMap
      },
      end: () => {
        if (!tableMap.header.length) return ''

        const { header, body } = tableMap

        const headerContent = header.map(({ title }) => `|${title}`).join('') + '|'
        this.text(headerContent, { level: getLevelFromOptions(opts) })
        const separator = header.map(() => '|--').join('') + '|'
        this.text(separator, { level: getLevelFromOptions(opts) })
        body.forEach((row) => {
          const content = header.map(({ key }) => `|${(row[key] ?? '').toString().replace(/\|/g, '\|')}`).join('') + '|'
          this.text(content, { level: getLevelFromOptions(opts) })
        })
      }
    }
    return actionMap
  }

  public anchor(key: string, link: string) {
    this.anchorMap[key] = link
  }
  public emptyLine() {
    if (!this.templateContent.endsWith(MdTools.enter())) {
      this.templateContent += MdTools.enter()
    }
    this.templateContent += MdTools.enter()
  }
  public modify(callback: (content: string) => string) {
    this.templateContent = callback(lodash.cloneDeep(this.templateContent))
    return this.contentNextUtils
  }
}

export const genTemplate = (callback: (utils: Template) => any = (() => { })) => {
  return readTemplate('', callback)
}

export const readTemplate = (text: string, callback: (utils: Template) => any = (() => { })) => {
  const templateInst = new Template(lodash.cloneDeep(text))
  callback(templateInst)
  return templateInst[Symbol.toStringTag]()
}
