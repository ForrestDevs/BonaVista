import type { Page } from '@payload-types'

export type CardBlockProps = Extract<Page['layout'][0], { blockType: 'card' }>
