type PickBlock<
  Blocks extends { blockType: string }[],
  BlockType extends Blocks[number]['blockType'],
> = Blocks extends (infer U)[]
  ? U extends {
      blockType: BlockType
    }
    ? U
    : never
  : never
