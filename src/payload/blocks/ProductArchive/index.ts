import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { PRODUCT_COLLECTION_SLUG, PRODUCT_CATEGORY_SLUG } from '@/payload/collections/constants'
import { PRODUCT_ARCHIVE_BLOCK_SLUG } from '../constants'

export const ProductArchive: Block = {
  slug: PRODUCT_ARCHIVE_BLOCK_SLUG,
  fields: [
    {
      label: 'Intro Content',
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      label: 'Middle Content',
      name: 'middleContent',
      type: 'richText',
      admin: {
        description: 'This content will be shown if the populate by is selection, between the different product collections and categories',
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      label: 'Populate By',
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      label: 'Collections to Show',
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: PRODUCT_COLLECTION_SLUG,
      options: [
        {
          label: 'Product Collections',
          value: PRODUCT_COLLECTION_SLUG,
        },
        {
          label: 'Product Categories',
          value: PRODUCT_CATEGORY_SLUG,
        },
      ],
    },
    {
      label: 'Limit',
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: 'Selection',
      relationTo: [PRODUCT_CATEGORY_SLUG],
    },
    {
      label: "Show Product Collections First",
      name: "showProductCollectionsFirst",
      type: "checkbox",
      defaultValue: true,
    },
  ],
  labels: {
    plural: 'Product Archives',
    singular: 'Product Archive',
  },
  interfaceName: 'ProductArchiveBlock',
}
