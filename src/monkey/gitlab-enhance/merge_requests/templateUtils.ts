const INDENT_SPACE_LENGTH = 2

let templateContent = ''
const indent = (level: number) => Array(level * INDENT_SPACE_LENGTH).fill(' ').join('')
const enter = () => '\n'

export const emptyLine = () => (templateContent += enter())

const contentUtils = {
  listItem: (text = '', { level = 1 } = {}) => {
    templateContent += `${indent(level - 1)}- ${text}${enter()}`
    return {
      ...contentUtils,
      end: emptyLine,
    }
  },
  taskItem: (text = '', { selected = false, level = 1 } = {}) => {
    return contentUtils.listItem(`[${selected ? 'x' : ' '}] ${text}`, { level })
  },
}

const header = (level: number) => (text: string) => {
  templateContent += `${Array(level).fill('#').join('')} ${text}${enter()}${enter()}`
  return contentUtils
}
export const h2 = header(2)
export const h3 = header(3)
export const h4 = header(4)

export const listItem = contentUtils.listItem
export const taskItem = contentUtils.taskItem
export const initTemplate = () => (templateContent = '')
export const getTemplate = () => templateContent
