import { link } from '@/payload/fields/link'
import { FixedToolbarFeature, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { FEATURED_SPAS_BLOCK_SLUG } from '../constants'

export const FeaturedSpas: Block = {
  slug: FEATURED_SPAS_BLOCK_SLUG,
  labels: {
    singular: 'Featured Spas Block',
    plural: 'Featured Spas Blocks',
  },
  fields: [
    {
      name: 'preTitle',
      type: 'text',
      label: 'Pre Title',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor(),
      label: 'Body',
    },
    {
      name: 'spas',
      type: 'relationship',
      relationTo: 'spas',
      hasMany: true,
      required: true,
      label: 'Featured Spas',
      maxRows: 3,
      admin: {
        description: 'Select up to 3 spas to feature',
      },
    },
    link({
      overrides: {
        admin: {
          description: 'Link to the shop hot tubs page',
        },
      },
    }),
  ],
}
