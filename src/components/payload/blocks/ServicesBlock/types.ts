import type { Page } from '@payload-types'

export type ServicesBlockProps = Extract<Page['layout'][0], { blockType: 'services' }>
