import { BlockType } from '../type'
import GroupBlock from './GroupBlock'

export default class DirectiveBlock extends GroupBlock {
  public readonly blockType = BlockType.Directive
  protected blocks: Array<{ blockType: BlockType.Directive | BlockType.Comment; id: string }> = []
  private directiveName: string
  public args: string[] = []

  constructor(name: string, ...args: string[]) {
    super()
    this.directiveName = name
    this.args = args
  }

  public get name(): string {
    return this.directiveName
  }

  public addDirectiveBlock(...args: ConstructorParameters<typeof DirectiveBlock>) {
    this.ensureUniqueChildBlockName(BlockType.Directive, args[0])
    const directive = new DirectiveBlock(...args)
    this.blocks.push(directive)
    return directive
  }

  public toString(): string {
    const commentString = this.comment ? ` # ${this.comment}` : ''
    if (this.blocks.length === 0) {
      return `${this.directiveName} ${this.args.join(' ')}${commentString}`
    }
    const blocksString = this.blocks
      .map((block) => block.toString())
      .join('\n')
      .replace(/^/gm, '  ')
    const afterCommentString = this.afterComment ? ` # ${this.afterComment}` : ''
    return [
      [this.directiveName, this.args.join(' '), `{${commentString}`].filter(Boolean).join(' '),
      blocksString,
      `}${afterCommentString}`,
    ].join('\n')
  }
}
