import { BlockType } from '../type'

export default abstract class Block {
  public readonly id =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  public comment: string | undefined
  public abstract readonly blockType: BlockType

  public abstract toString(): string
}
