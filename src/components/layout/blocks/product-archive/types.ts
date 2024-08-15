import type { Page } from '@payload-types'
import { PRODUCT_ARCHIVE_BLOCK_SLUG } from '@/payload/blocks/constants'

export type ArchiveBlockProps = Extract<Page['layout'][0], { blockType: typeof PRODUCT_ARCHIVE_BLOCK_SLUG }>