import type { Page } from '@payload-types'

export type ContactBlockProps = Extract<Page['layout'][0], { blockType: 'contact' }>
