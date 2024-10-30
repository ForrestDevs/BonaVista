import type { Page } from '@payload-types'
import { GRID_BLOCK_SLUG } from '@payload/blocks/constants'

export type GridBlockProps = Extract<Page['layout'][0], { blockType: typeof GRID_BLOCK_SLUG }>
