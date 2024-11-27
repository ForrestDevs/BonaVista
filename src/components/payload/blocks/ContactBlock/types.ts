import type { Page } from '@payload-types'

export type ContactBlockProps = Extract<
  NonNullable<Page['layout']>[number],
  { blockType: 'contact' }
>
