import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { ArchiveBlock } from '@/components/layout/blocks/archive'
import { CallToActionBlock } from '@/components/layout/blocks/call-to-action'
import { ContentBlock } from '@/components/layout/blocks/content'
import { FormBlock } from '@/components/layout/blocks/form'
import { MediaBlock } from '@/components/layout/blocks/media'
import { toKebabCase } from '@/lib/utils/toKebabCase'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
}

export const Blocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block id={toKebabCase(blockName ?? '')} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
