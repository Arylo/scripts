import Block from './blocks/Block'
import CommentBlock from './blocks/CommentBlock'
import GlobalBlock from './blocks/GlobalBlock'
import SiteBlock from './blocks/SiteBlock'
import SnippetBlock from './blocks/SnippetBlock'
import { BlockType } from './type'

export default class Caddyfile {
  private blocks: Block[] = []

  private ensureUniqueRootBlockName(blockType: BlockType, name: string) {
    const duplicatedBlock = this.blocks.find(
      (block) =>
        block.blockType === blockType &&
        'name' in block &&
        typeof block.name === 'string' &&
        block.name === name,
    )
    if (duplicatedBlock) {
      throw new Error(`${blockType} block name must be unique at root level: ${name}`)
    }
  }

  // Global block
  public addGlobalBlock() {
    if (this.hasGlobalBlock()) {
      throw new Error('Only one Global block is allowed at root level')
    }
    const block = new GlobalBlock()
    this.blocks.push(block)
    return block
  }
  public removeGlobalBlock() {
    this.blocks = this.blocks.filter((block) => !(block instanceof GlobalBlock))
  }
  public hasGlobalBlock() {
    return this.blocks.some((block) => block instanceof GlobalBlock)
  }
  public getGlobalBlock() {
    return this.blocks.find((block) => block instanceof GlobalBlock) as GlobalBlock | undefined
  }

  // Snippet block
  public addSnippetBlock(name: string) {
    this.ensureUniqueRootBlockName(BlockType.Snippet, name)
    const block = new SnippetBlock(name)
    this.blocks.push(block)
    return block
  }
  public removeSnippetBlockById(id: string) {
    this.blocks = this.blocks.filter((block) => !(block instanceof SnippetBlock && block.id === id))
  }
  public getSnippetBlockByName(name: string) {
    return this.blocks.find((block) => block instanceof SnippetBlock && block.name === name) as
      | SnippetBlock
      | undefined
  }
  public listSnippetBlock() {
    return this.blocks.filter((block) => block instanceof SnippetBlock)
  }

  // Site block
  public addSiteBlock(name: string | string[]) {
    const block = new SiteBlock(name)
    this.blocks.push(block)
    return block
  }
  public removeSiteBlockById(id: string) {
    this.blocks = this.blocks.filter((block) => !(block instanceof SiteBlock && block.id === id))
  }
  public getSiteBlockById(id: string) {
    return this.blocks.find((block) => block instanceof SiteBlock && block.id === id) as
      | SiteBlock
      | undefined
  }
  public listSiteBlock() {
    return this.blocks.filter((block) => block instanceof SiteBlock) as SiteBlock[]
  }

  // Comment block
  public addCommentBlock(comment: string) {
    const block = new CommentBlock(comment)
    this.blocks.push(block)
    return block
  }
  public removeCommentBlockById(id: string) {
    this.blocks = this.blocks.filter((block) => !(block instanceof CommentBlock && block.id === id))
  }
  public getCommentBlockById(id: string) {
    return this.blocks.find((block) => block instanceof CommentBlock && block.id === id) as
      | CommentBlock
      | undefined
  }

  public toString() {
    return this.blocks.map((block) => block.toString()).join('\n') + '\n'
  }
}
