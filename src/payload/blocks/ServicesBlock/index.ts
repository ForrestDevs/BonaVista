import type { Block } from 'payload'
import { SERVICES_BLOCK_SLUG } from '../constants'
import { link } from '@/payload/fields/link'

export const ServicesBlock: Block = {
  slug: SERVICES_BLOCK_SLUG,
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'offerings',
      label: 'Offerings',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          label: 'Image',
          relationTo: 'media',
          type: 'upload',
          required: true,
        },
        link({
          disableLabel: true,
        }),
      ],
    },
  ],
  labels: {
    plural: 'Services',
    singular: 'Service',
  },
}
