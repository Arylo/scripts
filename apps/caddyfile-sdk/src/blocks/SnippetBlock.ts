import { BlockType } from '../type'
import DirectiveBlock from './DirectiveBlock'
import GroupBlock from './GroupBlock'

export default class SnippetBlock extends GroupBlock {
  protected blocks: Array<{ blockType: BlockType.Directive | BlockType.Comment; id: string }> = []
  public readonly blockType = BlockType.Snippet

  constructor(public name: string) {
    super()
  }

  public addDirectiveBlock(name: string, ...args: string[]) {
    this.ensureUniqueChildBlockName(BlockType.Directive, name)
    const directive = new DirectiveBlock(name, ...args)
    this.blocks.push(directive)
    return directive
  }

  public toString(): string {
    const blocksString = this.blocks
      .map((block) => block.toString())
      .join('\n')
      .replace(/^/gm, '  ')
    const commentString = this.comment ? ` # ${this.comment}` : ''
    const afterCommentString = this.afterComment ? ` # ${this.afterComment}` : ''
    return [`(${this.name}) {${commentString}`, blocksString, `}${afterCommentString}`].join('\n')
  }
}
