import type { Block } from 'payload'
import { SERVICES_BLOCK_SLUG } from '../constants'
import { link } from '@/payload/fields/link'

export const ServicesBlock: Block = {
  slug: SERVICES_BLOCK_SLUG,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Intro',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
            },
            {
              name: 'subtitle',
              label: 'Subtitle',
              type: 'text',
            },
            {
              name: 'body',
              label: 'Body',
              type: 'textarea',
            },
            {
              type: 'collapsible',
              fields: [link()],
              label: 'Link',
            },
          ],
        },
        {
          label: 'Offerings',
          fields: [
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
                {
                  type: 'collapsible',
                  fields: [link()],
                  label: 'Link',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Services',
    singular: 'Service',
  },
  interfaceName: 'ServicesBlock',
}
