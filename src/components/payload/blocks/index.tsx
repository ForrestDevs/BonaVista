import React, { Fragment } from 'react'
import type { Page } from '@payload-types'
import { ArchiveBlock } from '@components/payload/blocks/ArchiveBlock'
import { CallToActionBlock } from '@components/payload/blocks/CallToAction'
import { ContentBlock } from '@components/payload/blocks/Content'
import { FormBlock } from '@components/payload/blocks/Form'
import { MediaBlock } from '@components/payload/blocks/MediaBlock'
import { ShopArchiveBlock } from '@components/payload/blocks/ShopArchive'
import { TestimonialBlock } from './TestimonialBlock'
import { ContactBlock } from './ContactBlock'
import { TypographyBlock } from './Typography'
import { LatestPostsBlock } from './LatestPosts'
import { ServicesBlock } from './ServicesBlock'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  'shop-archive': ShopArchiveBlock,
  testimonials: TestimonialBlock,
  contact: ContactBlock,
  typography: TypographyBlock,
  'latest-posts': LatestPostsBlock,
  services: ServicesBlock,
} as const

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
          const Block = blockComponents[blockType]

          return Block ? (
            <div className="" key={index}>
              <Block {...block} id={block.id?.toString()} />
            </div>
          ) : null
        })}
      </Fragment>
    )
  }

  return null
}
