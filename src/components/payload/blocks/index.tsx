import React, { Fragment } from 'react'

import type { Page } from '@payload-types'
import { ArchiveBlock } from '@components/payload/blocks/ArchiveBlock'
import { CallToActionBlock } from '@components/payload/blocks/CallToAction'
import { ContentBlock } from '@components/payload/blocks/Content'
import { FormBlock } from '@components/payload/blocks/Form'
import { MediaBlock } from '@components/payload/blocks/MediaBlock'
import { toKebabCase } from '@lib/utils/toKebabCase'
import { ShopArchiveBlock } from '@components/payload/blocks/ShopArchive'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  'shop-archive': ShopArchiveBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block {...(block as any)} id={block.id?.toString()} />
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
