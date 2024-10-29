import type { Page } from '@payload-types'

export type TypographyBlockProps = Extract<Page['layout'][0], { blockType: 'typography' }>
