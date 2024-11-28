import type { Page } from '@payload-types'
import { FEATURED_SPAS_BLOCK_SLUG } from '@payload/blocks/constants'

export type FeaturedSpasBlockProps = Extract<
  Page['layout'][0],
  { blockType: typeof FEATURED_SPAS_BLOCK_SLUG }
>
