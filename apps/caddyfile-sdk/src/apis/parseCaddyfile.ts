import Caddyfile from '../Caddyfile'

const BLOCK_START_RE = /\{\s*(?:#.*)?$/
const BLOCK_END_RE = /^}\s*(?:#\s*(.*))?$/

type DirectiveContainer = {
  addCommentBlock(comment: string): unknown
  addDirectiveBlock(name: string, ...args: string[]): DirectiveGroup
  comment?: string
  afterComment?: string
}

type MatcherContainer = DirectiveContainer & {
  addMatcherBlock(name: string): DirectiveContainer
}

type DirectiveGroup = DirectiveContainer

function splitBlocks(lines: string[]) {
  const blocks: string[][] = []
  let current: string[] = []
  let depth = 0

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    if (depth === 0 && trimmedLine.startsWith('#')) {
      blocks.push([line])
      continue
    }

    if (depth === 0) {
      current = [line]
      if (BLOCK_START_RE.test(trimmedLine)) {
        depth = 1
      } else {
        blocks.push(current)
        current = []
      }
      continue
    }

    current.push(line)
    if (BLOCK_START_RE.test(trimmedLine)) {
      depth += 1
    }
    if (BLOCK_END_RE.test(trimmedLine)) {
      depth -= 1
    }
    if (depth === 0) {
      blocks.push(current)
      current = []
    }
  }

  if (current.length > 0) {
    blocks.push(current)
  }

  return blocks
}

function parseOpenLine(line: string) {
  const match = line.trim().match(/^(.*?)\s*\{\s*(?:#\s*(.*))?$/)
  if (!match) return
  return {
    header: match[1].trim(),
    comment: match[2]?.trim(),
  }
}

function parseInlineLine(line: string) {
  const match = line.trim().match(/^(.*?)(?:\s+#\s*(.*))?$/)
  if (!match) return
  return {
    body: match[1].trim(),
    comment: match[2]?.trim(),
  }
}

function splitArgs(text: string) {
  return text
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseDirectiveBlock(target: DirectiveContainer, content: string[]) {
  const firstLine = content[0]?.trim()
  if (!firstLine || firstLine.startsWith('#')) return

  if (BLOCK_START_RE.test(firstLine)) {
    const open = parseOpenLine(content[0])
    if (!open) return
    const [name, ...args] = splitArgs(open.header)
    if (!name) return
    const directive = target.addDirectiveBlock(name, ...args)
    directive.comment = open.comment
    directive.afterComment = content[content.length - 1]?.trim().match(BLOCK_END_RE)?.[1]?.trim()
    parseGroupBlocks(directive, content.slice(1, -1))
    return
  }

  const inline = parseInlineLine(content[0])
  if (!inline?.body) return
  const [name, ...args] = splitArgs(inline.body)
  if (!name) return
  const directive = target.addDirectiveBlock(name, ...args)
  directive.comment = inline.comment
}

function parseMatcherBlock(target: MatcherContainer, content: string[]) {
  const open = parseOpenLine(content[0])
  if (!open?.header.startsWith('@')) return
  const matcher = target.addMatcherBlock(open.header)
  matcher.comment = open.comment
  matcher.afterComment = content[content.length - 1]?.trim().match(BLOCK_END_RE)?.[1]?.trim()
  parseGroupBlocks(matcher, content.slice(1, -1))
}

function parseGroupBlocks(target: DirectiveContainer | MatcherContainer, lines: string[]) {
  for (const block of splitBlocks(lines)) {
    const text = block[0]?.trim()
    if (!text) continue
    if (text.startsWith('#')) {
      target.addCommentBlock(text.replace(/^#\s*/, ''))
      continue
    }
    if ('addMatcherBlock' in target && text.startsWith('@') && BLOCK_START_RE.test(text)) {
      parseMatcherBlock(target, block)
      continue
    }
    parseDirectiveBlock(target, block)
  }
}

function splitContent(text: string) {
  const [list] = text.split('\n').reduce(
    ([list, start, num], line, index) => {
      const trimmedLine = line.trim()
      if (num === 0 && /^\s*#/.test(trimmedLine)) {
        list.push([line])
      } else if (/{(\s+#.*)?$/.test(trimmedLine)) {
        if (num === 0) {
          start = index
        }
        num += 1
      } else if (
        num > 0 &&
        /}(\s+#.*)?$/.test(trimmedLine) &&
        !/\w+}(\s+#.*)?$/.test(trimmedLine)
      ) {
        num -= 1
        if (num === 0) {
          list.push(text.split('\n').slice(start, index + 1))
          start = -1
        }
      }
      return [list, start, num]
    },
    [[], -1, 0] as [string[][], number, number],
  )
  return list
}

function parseComment(caddyfile: Caddyfile, content: string[]) {
  const text = content[0].trim()
  if (!text.startsWith('#')) return
  const comment = text.replace(/^#\s*/, '')
  caddyfile.addCommentBlock(comment)
}

function parseGlobalBlock(caddyfile: Caddyfile, content: string[]) {
  const text = content[0].trim()
  if (!text.startsWith('{')) return
  const globalBlock = caddyfile.addGlobalBlock()
  const open = parseOpenLine(content[0])
  globalBlock.comment = open?.comment
  globalBlock.afterComment = content[content.length - 1]?.trim().match(BLOCK_END_RE)?.[1]?.trim()
  parseGroupBlocks(globalBlock, content.slice(1, -1))
}

function parseSnippetBlock(caddyfile: Caddyfile, content: string[]) {
  const text = content[0].trim()
  if (!text.startsWith('(')) return
  const open = parseOpenLine(content[0])
  if (!open) return
  const name = open?.header.match(/^\((.*)\)$/)?.[1]?.trim()
  if (!name) return
  const snippetBlock = caddyfile.addSnippetBlock(name)
  snippetBlock.comment = open.comment
  snippetBlock.afterComment = content[content.length - 1]?.trim().match(BLOCK_END_RE)?.[1]?.trim()
  parseGroupBlocks(snippetBlock, content.slice(1, -1))
}

function parseSiteBlock(caddyfile: Caddyfile, content: string[]) {
  const text = content[0].trim()
  if (text.startsWith('#') || text.startsWith('{') || text.startsWith('(')) return
  const open = parseOpenLine(content[0])
  if (!open?.header) return
  const siteNames = open.header
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const siteBlock = caddyfile.addSiteBlock(siteNames)
  siteBlock.comment = open.comment
  siteBlock.afterComment = content[content.length - 1]?.trim().match(BLOCK_END_RE)?.[1]?.trim()
  parseGroupBlocks(siteBlock, content.slice(1, -1))
}

export function parse(text: string = '') {
  const list = splitContent(text)
  const caddyfile = new Caddyfile()
  for (const content of list) {
    parseComment(caddyfile, content)
    parseGlobalBlock(caddyfile, content)
    parseSnippetBlock(caddyfile, content)
    parseSiteBlock(caddyfile, content)
  }
  return caddyfile
}

export function parseCaddyfile(...options: Parameters<typeof parse>) {
  return parse(...options)
}
