import type { CollectionConfig } from 'payload'

import { generatePreviewPath } from '@payload/utilities/generatePreviewPath'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ToolbarGroup,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import type { ProductVariant } from './ui/types'

import { admins, adminsOrPublished } from '@payload/access'
import { CallToAction } from '@payload/blocks/CallToAction'
import { Content } from '@payload/blocks/Content'
import { MediaBlock } from '@payload/blocks/MediaBlock'
import { slugField } from '@payload/fields/slug'
// import { beforeProductChange } from './hooks/beforeChange'
// import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'
import { revalidateProduct } from './hooks/revalidateProduct'
import { PRODUCT_CATEGORY_SLUG, SHOP_COLLECTION_SLUG, PRODUCT_SLUG, BRAND_SLUG } from '../constants'
import { TableFeatureClient } from '@payloadcms/richtext-lexical/client'

const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: admins,
    delete: admins,
    read: adminsOrPublished,
    update: admins,
  },
  admin: {
    defaultColumns: ['title', 'stripeProductID', '_status'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          path: `/product/${typeof data?.slug === 'string' ? data.slug : ''}`,
        })
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (doc) =>
      generatePreviewPath({ path: `/product/${typeof doc?.slug === 'string' ? doc.slug : ''}` }),
    useAsTitle: 'title',
  },
  fields: [
    slugField(),
    {
      label: 'Title',
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: false,
            },
            {
              name: 'gallery',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
              labels: {
                plural: 'Images',
                singular: 'Image',
              },
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock],
            },
          ],
        },
        {
          label: 'Product Details',
          fields: [
            {
              name: 'enableVariants',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Check this if the product has multiple variants',
              },
            },
            {
              name: 'baseProduct',
              type: 'group',
              admin: {
                condition: (data) => Boolean(!data.enableVariants),
              },
              fields: [
                {
                  name: 'sku',
                  type: 'text',
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      label: 'Enable Inventory',
                      name: 'enableInventory',
                      type: 'checkbox',
                      admin: {
                        description: 'Check this if you want to track inventory for this product',
                      },
                      defaultValue: false,
                    },
                    {
                      label: 'Inventory',
                      name: 'inventory',
                      type: 'number',
                      admin: {
                        condition: (data) => data.baseProduct.enableInventory,
                        description:
                          'Define stock for this product. A stock of 0 disables checkout for this product.',
                      },
                      required: true,
                      defaultValue: 0,
                    },
                  ],
                },
                {
                  name: 'price',
                  type: 'number',
                  admin: {
                    description: 'Define the price for this product.',
                  },
                },
              ],
            },
            {
              label: false,
              name: 'variants',
              type: 'group',
              admin: {
                condition: (data) => Boolean(data.enableVariants),
              },
              fields: [
                {
                  label: 'Variant options',
                  name: 'options',
                  type: 'array',
                  minRows: 1,
                  admin: {
                    components: {
                      RowLabel: 'src/payload/collections/Products/ui/RowLabels/KeyLabel',
                    },
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'slug',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'values',
                      type: 'array',
                      admin: {
                        components: {
                          RowLabel: 'src/payload/collections/Products/ui/RowLabels/OptionLabel',
                        },
                        initCollapsed: true,
                      },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            {
                              name: 'label',
                              type: 'text',
                              required: true,
                            },
                            {
                              name: 'slug',
                              type: 'text',
                              required: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  labels: {
                    plural: 'Variants',
                    singular: 'Variant',
                  },
                  interfaceName: 'ProductVariant',
                  name: 'variantProducts',
                  type: 'array',
                  admin: {
                    components: {
                      RowLabel: 'src/payload/collections/Products/ui/RowLabels/VariantLabel',
                    },
                    condition: (data) => {
                      return Boolean(data?.variants?.options?.length)
                    },
                  },
                  fields: [
                    {
                      name: 'options',
                      type: 'text',
                      admin: {
                        components: {
                          Field: 'src/payload/collections/Products/ui/VariantSelect',
                        },
                      },
                      hasMany: true,
                      required: true,
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'sku',
                          type: 'text',
                          required: true,
                          unique: true,
                        },
                        {
                          name: 'price',
                          type: 'number',
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'stock',
                      type: 'number',
                      admin: {
                        description:
                          'Define stock for this variant. A stock of 0 disables checkout for this variant.',
                        width: '50%',
                      },
                      defaultValue: 0,
                      required: true,
                    },
                    {
                      name: 'images',
                      type: 'array',
                      fields: [
                        {
                          name: 'image',
                          type: 'upload',
                          relationTo: 'media',
                        },
                      ],
                    },
                  ],
                  minRows: 1,
                  
                  validate: (_, { data }) => {
                    //@ts-ignore
                    if (data.variants.variantProducts.length > 1) {
                      //@ts-ignore
                      const optionSets = data.variants.variantProducts.map((variant) =>
                        variant.options.sort().join('|'),
                      )

                      const uniqueOptionSets = new Set(optionSets)

                      if (uniqueOptionSets.size !== optionSets.length) {
                        return 'There is a duplicate variant'
                      }
                    }

                    return true
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: {
        singular: 'Brand',
        plural: 'Brands',
      },
      name: 'brand',
      type: 'relationship',
      hasMany: true,
      relationTo: BRAND_SLUG,
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
    },
    {
      label: {
        singular: 'Collection',
        plural: 'Collections',
      },
      name: 'collections',
      type: 'relationship',
      relationTo: SHOP_COLLECTION_SLUG,
      hasMany: true,
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
    },
    {
      label: {
        singular: 'Category',
        plural: 'Categories',
      },
      name: 'categories',
      type: 'relationship',
      relationTo: PRODUCT_CATEGORY_SLUG,
      hasMany: true,
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
    },
    {
      label: {
        singular: 'Related Product',
        plural: 'Related Products',
      },
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: PRODUCT_SLUG,
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    {
      name: 'isSale',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isBestSeller',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isNewSeller',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'skipSync',
      type: 'checkbox',
      admin: {
        hidden: true,
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Skip Sync',
    },
  ],
  hooks: {
    afterChange: [revalidateProduct],
    // afterDelete: [deleteProductFromCarts],
    // beforeChange: [beforeProductChange],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
} as const

export default Products
