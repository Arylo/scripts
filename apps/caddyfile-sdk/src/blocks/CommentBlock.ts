import { BlockType } from '../type'
import Block from './Block'

export default class CommentBlock extends Block {
  public readonly blockType = BlockType.Comment

  constructor(comment: string) {
    super()
    this.comment = comment
  }

  public toString(): string {
    return `# ${this.comment ?? ''}`.trim()
  }
}
