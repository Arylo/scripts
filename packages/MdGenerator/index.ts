import lodash from 'lodash'

const INDENT_SPACE_LENGTH = 2

const indent = (level: number) => Array(level * INDENT_SPACE_LENGTH).fill(' ').join('')
export const enter = () => '\n'

const header = (level: number) => (text: string) => {
  return `${Array(level).fill('#').join('')} ${text}`
}
export const h1 = header(1)
export const h2 = header(2)
export const h3 = header(3)
export const h4 = header(4)
export const h5 = header(5)
export const text = (content = '', { level = 1 } = {}) => `${indent(level - 1)}${content}${enter()}`
export const anchor = (key: string, url: string) => `[${key}]: ${url}`
export const hyperlink = (label: string, url: string) => `[${label}](${url})`
export const hyperlinkWithKey = (label: string, key: string) => `[${label}][${key}]`
export const image = (url: string, alt: string = '') => `!${hyperlink(alt, url)}`
export const imageByKey = (key: string, alt: string = '') => `!${hyperlinkWithKey(alt, key)}`

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

  private header = (level: number) => (text: string) => {
    this.templateContent += header(level)(text)
    this.templateContent += `${enter()}${enter()}`
    return this.headerNextUtils
  }
  public h1(text: string) {
    return this.header(1)(text)
  }
  public h2(text: string) {
    return this.header(2)(text)
  }
  public h3(text: string) {
    return this.header(3)(text)
  }
  public h4(text: string) {
    return this.header(4)(text)
  }
  public h5(text: string) {
    return this.header(5)(text)
  }
  public [Symbol.toStringTag]() {
    return [
      this.templateContent,
      this.templateContent && !/\n$/.test(this.templateContent) && enter(),
      Object.keys(this.anchorMap).length && enter(),
      Object.entries(this.anchorMap).map(([key, value]) => anchor(key, value)).join(enter()),
      Object.keys(this.anchorMap).length && enter(),
    ].filter(Boolean).join('').replace(/\n(\s*\n){2,}/g, '\n\n')
  }

  public text(content = '', { level = 1 } = {}) {
    this.templateContent += text(content, { level })
    return this.contentNextUtils
  }
  public listItem(text = '', { level = 1 } = {}) {
    return this.text(`- ${text}`, { level })
  }
  public taskItem(text = '', { selected = false, level = 1 } = {}) {
    return this.listItem(`[${selected ? 'x' : ' '}] ${text}`, { level })
  }
  public hyperlink(text: string, link: string, { anchorKey = '', level = 1 } = {}) {
    let content!: string
    if (typeof anchorKey === 'string' && anchorKey.length) {
      this.anchor(anchorKey, link)
      content = hyperlinkWithKey(text, anchorKey)
    } else {
      content = hyperlink(text, link)
    }
    return this.text(content, { level })
  }
  public image(url: string, { alt = '', anchorKey = '', level = 1 } = {}) {
    let content!: string
    if (typeof anchorKey === 'string' && anchorKey.length) {
      this.anchor(anchorKey, url)
      content = imageByKey(alt, anchorKey)
    } else {
      content = image(alt, url)
    }
    return this.text(content, { level })
  }

  private tableMap = new Map<Symbol, { header: { key: string, title: string }[], body: Record<string, string | number>[]}>()
  private appendTableHeader(flag: Symbol, key: string, title: string) {
    if (!this.tableMap.has(flag)) {
      this.tableMap.set(flag, { header: [], body: [] })
    }
    this.tableMap.get(flag)!.header.push({ key, title })
  }
  private appendTableBody(flag: Symbol, row: Record<string, string | number>) {
    if (!this.tableMap.has(flag)) {
      this.tableMap.set(flag, { header: [], body: [] })
    }
    this.tableMap.get(flag)!.body.push(row)
  }
  public table ({ level = 1 } = {}) {
    const flag = Symbol('')
    const action = {
      header: (row: { key: string, title: string }[]) => {
        row.forEach(({ key, title }) => {
          this.appendTableHeader(flag, key, title)
        })
        return action
      },
      body: (row: Record<string, string | number>) => {
        this.appendTableBody(flag, row)
        return action
      },
      end: () => {
        if (!this.tableMap.has(flag) || !this.tableMap.get(flag)!.header.length) return ''
        const headerContent = this.tableMap.get(flag)!.header.map(({ title }) => `|${title}`).join('') + '|'
        this.text(headerContent, { level })
        const separator = this.tableMap.get(flag)!.header.map(() => '|--').join('') + '|'
        this.text(separator, { level })
        this.tableMap.get(flag)!.body.forEach((row) => {
          const content = this.tableMap.get(flag)!.header.map(({ key }) => `|${(row[key] ?? '').toString().replace(/\|/g, '\|')}`).join('') + '|'
          this.text(content, { level })
        })
        this.tableMap.delete(flag)
      }
    }
    return action
  }

  public anchor(key: string, link: string) {
    this.anchorMap[key] = link
  }
  public emptyLine() {
    this.templateContent += enter()
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
