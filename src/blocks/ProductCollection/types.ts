import type { Page } from '@/payload-types'

export type ProductCollectionProps = Extract<Page['layout'][0], { blockType: 'product-collection' }>
