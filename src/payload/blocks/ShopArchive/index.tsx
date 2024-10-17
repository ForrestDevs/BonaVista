import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { SHOP_COLLECTION_SLUG, PRODUCT_CATEGORY_SLUG } from '@payload/collections/constants'
import { SHOP_ARCHIVE_BLOCK_SLUG } from '@payload/blocks/constants'

export const ShopArchive: Block = {
  slug: SHOP_ARCHIVE_BLOCK_SLUG,
  interfaceName: 'ShopArchive',
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
      label: 'Populate By',
      name: 'populateBy',
      type: 'select',
      defaultValue: SHOP_COLLECTION_SLUG,
      options: [
        {
          label: 'Product Collections',
          value: SHOP_COLLECTION_SLUG,
        },
        {
          label: 'Product Categories',
          value: PRODUCT_CATEGORY_SLUG,
        },
      ],
    },
    {
      label: 'Show All Collections',
      name: 'showAllCollections',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      label: 'Select Product Collections',
      name: 'productCollections',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData.showAllCollections === false &&
          siblingData.populateBy === SHOP_COLLECTION_SLUG,
      },
      relationTo: SHOP_COLLECTION_SLUG,
      hasMany: true,
    },
    {
      label: 'Select Product Categories',
      name: 'productCategories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData.showAllCollections === false &&
          siblingData.populateBy === PRODUCT_CATEGORY_SLUG,
      },
      relationTo: PRODUCT_CATEGORY_SLUG,
      hasMany: true,
    },

    // {
    //   label: 'Limit',
    //   name: 'limit',
    //   type: 'number',
    //   admin: {
    //     condition: (_, siblingData) => siblingData.populateBy === 'collection',
    //     step: 1,
    //   },
    //   defaultValue: 10,
    // },
    // {
    //   name: 'selectedDocs',
    //   type: 'relationship',
    //   admin: {
    //     condition: (_, siblingData) => siblingData.populateBy === 'selection',
    //   },
    //   hasMany: true,
    //   label: 'Selection',
    //   relationTo: [SHOP_COLLECTION_SLUG, PRODUCT_CATEGORY_SLUG],
    // },
  ],
  labels: {
    plural: 'Shop Archives',
    singular: 'Shop Archive',
  },
}
