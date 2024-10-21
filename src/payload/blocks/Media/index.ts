import { MEDIA_SLUG } from '@/payload/collections/constants'
import type { Block } from 'payload'

export const Media: Block = {
  slug: 'mediaBlock',
  fields: [
    {
      name: 'position',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Fullscreen',
          value: 'fullscreen',
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: MEDIA_SLUG,
      required: true,
    },
  ],
}
