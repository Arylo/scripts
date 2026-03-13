import { BlockType } from '../type'
import Block from './Block'
import CommentBlock from './CommentBlock'

export default abstract class GroupBlock extends Block {
  private afterCommentText: string | undefined

  public get afterComment(): string | undefined {
    return this.afterCommentText
  }

  public set afterComment(comment: string | undefined) {
    this.afterCommentText = comment
  }

  protected blocks: { blockType: BlockType; id: string }[] = []

  protected ensureUniqueChildBlockName(blockType: BlockType, name: string) {
    const duplicatedBlock = this.blocks.find(
      (block) =>
        block.blockType === blockType &&
        'name' in block &&
        typeof block.name === 'string' &&
        block.name === name,
    )
    if (duplicatedBlock) {
      throw new Error(`${blockType} block name must be unique in the same parent block: ${name}`)
    }
  }

  public addCommentBlock(comment: string) {
    const commentBlock = new CommentBlock(comment)
    this.blocks.push(commentBlock)
    return commentBlock
  }

  public listBlocks() {
    return this.blocks
  }

  public removeBlockById(id: string) {
    this.blocks = this.blocks.filter((block) => block.id !== id)
  }
}
