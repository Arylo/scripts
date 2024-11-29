const INDENT_SPACE_LENGTH = 2

const indent = (level: number) => Array(level * INDENT_SPACE_LENGTH).fill(' ').join('')
const enter = () => '\n'

class Template {
  protected templateContent: string
  constructor(text: string) {
    this.templateContent = text
  }

  private headerNextUtils = {
    text: this.text.bind(this),
    listItem: this.listItem.bind(this),
    taskItem: this.taskItem.bind(this),
  }

  private contentNextUtils = {
    ...this.headerNextUtils,
    end: this.emptyLine.bind(this),
  }

  private header = (level: number) => (text: string) => {
    this.templateContent += `${Array(level).fill('#').join('')} ${text}${enter()}${enter()}`
    return this.headerNextUtils
  }
  public h2 (text: string) {
    return this.header(2)(text)
  }
  public h3 (text: string) {
    return this.header(3)(text)
  }
  public h4 (text: string) {
    return this.header(4)(text)
  }
  public [Symbol.toStringTag]() {
    return this.templateContent.replace(/\n{3,}$/, '\n\n')
  }

  public text(text = '', { level = 1 } = {}) {
    this.templateContent += `${indent(level - 1)}${text}${enter()}`
    return this.contentNextUtils
  }
  public listItem(text = '', { level = 1 } = {}) {
    return this.text(`- ${text}`, { level })
  }
  public taskItem(text = '', { selected = false, level = 1 } = {}) {
    return this.listItem(`[${selected ? 'x' : ' '}] ${text}`, { level })
  }

  public emptyLine() {
    this.templateContent += enter()
  }
}

export const genTemplate = (callback: (utils: Template) => any = (() => {})) => {
  const templateInst = new Template('')
  callback(templateInst)
  return templateInst[Symbol.toStringTag]()
}
