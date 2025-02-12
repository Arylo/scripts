const INDENT_SPACE_LENGTH = 2

export function indent (level: number, content = '') {
  return `${Array((level - 1) * INDENT_SPACE_LENGTH).fill(' ').join('')}${content}`
}

export function enter() {
  return '\n'
}

export type HeaderLevel = 1 | 2 | 3 | 4 | 5
const header = (level: HeaderLevel) => (text = '') => `${Array(level).fill('#').join('')} ${text}`.trim()

export function h1 (...args: Parameters<ReturnType<typeof header>>) {
  return header(1)(...args)
}
export function h2 (...args: Parameters<ReturnType<typeof header>>) {
  return header(2)(...args)
}
export function h3 (...args: Parameters<ReturnType<typeof header>>) {
  return header(3)(...args)
}
export function h4 (...args: Parameters<ReturnType<typeof header>>) {
  return header(4)(...args)
}
export function h5 (...args: Parameters<ReturnType<typeof header>>) {
  return header(5)(...args)
}

export function text(content = '') {
  return content
}
export function anchor(key: string, url: string) {
  return `[${key}]: ${url}`
}

export function hyperlink(label: string, url: string) {
  return `[${label}](${url})`
}

export function hyperlinkWithKey(label: string, key: string) {
  return `[${label}][${key}]`
}

export function image(url: string, alt = '') {
  return `!${hyperlink(alt, url)}`
}

export function imageByKey(key: string, alt = '') {
  return `!${hyperlinkWithKey(alt, key)}`
}

export function listItem(text = '') {
  return `- ${text}`.trimEnd()
}

export function taskItem(text = '', { selected = false } = {}) {
  return `[${selected ? 'x' : ' '}] ${text}`.trimEnd()
}
