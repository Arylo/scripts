import { BlockType } from '../type'
import DirectiveBlock from './DirectiveBlock'
import GroupBlock from './GroupBlock'
import MatcherBlock from './MatcherBlock'

export default class SiteBlock extends GroupBlock {
  protected blocks: Array<{
    blockType: BlockType.Matcher | BlockType.Directive | BlockType.Comment
    id: string
  }> = []
  public readonly blockType = BlockType.Site
  private names: string[]

  constructor(name: string | string[]) {
    super()
    const names = (Array.isArray(name) ? name : [name]).map((item) => item.trim()).filter(Boolean)
    if (names.length === 0) {
      throw new Error('Site block must have at least one name')
    }
    this.names = names
  }

  public addDirectiveBlock(name: string, ...args: string[]) {
    this.ensureUniqueChildBlockName(BlockType.Directive, name)
    const directive = new DirectiveBlock(name, ...args)
    this.blocks.push(directive)
    return directive
  }

  public addMatcherBlock(name: string) {
    const normalizedName = name.replace(/^@/, '')
    this.ensureUniqueChildBlockName(BlockType.Matcher, normalizedName)
    const matcher = new MatcherBlock(name)
    this.blocks.push(matcher)
    return matcher
  }

  public toString(): string {
    const blocksString = this.blocks
      .map((block) => block.toString())
      .join('\n')
      .replace(/^/gm, '  ')
    const commentString = this.comment ? ` # ${this.comment}` : ''
    const afterCommentString = this.afterComment ? ` # ${this.afterComment}` : ''
    return [
      `${this.names.join(', ')} {${commentString}`,
      blocksString,
      `}${afterCommentString}`,
    ].join('\n')
  }
}
