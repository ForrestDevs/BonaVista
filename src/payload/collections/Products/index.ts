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
import { Media } from '@payload/blocks/Media'
import { slugField } from '@payload/fields/slug'
// import { beforeProductChange } from './hooks/beforeChange'
// import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'
import { revalidateProduct } from './hooks/revalidateProduct'
import {
  PRODUCT_CATEGORY_SLUG,
  SHOP_COLLECTION_SLUG,
  PRODUCT_SLUG,
  BRAND_SLUG,
  PRODUCT_COLLECTION_SLUG,
} from '../constants'
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
    group: 'Shop',
    defaultColumns: ['title', 'stripeProductID', '_status'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'products',
        })

        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'products',
      })

      return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    ...slugField(),
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
    },
    {
      label: 'Related Products',
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: PRODUCT_SLUG,
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    {
      label: 'Additional Info',
      name: 'moreInfo',
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
      required: false,
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
                      label: 'Product Active',
                      name: 'productActive',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        description: 'Shows or hides the product from the shop. Default is true.',
                      },
                      required: true,
                    },
                    {
                      label: 'Sold Online',
                      name: 'soldOnline',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        description: 'Allows the product to be sold online. Default is true.',
                      },
                      required: true,
                    },
                  ],
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
                      RowLabel: '@/payload/collections/Products/ui/RowLabels/KeyLabel#KeyLabel',
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
                          RowLabel:
                            '@/payload/collections/Products/ui/RowLabels/OptionLabel#OptionLabel',
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
                  minRows: 1,
                  admin: {
                    components: {
                      RowLabel:
                        '@/payload/collections/Products/ui/RowLabels/VariantLabel#VariantLabel',
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
                          Field: '@/payload/collections/Products/ui/VariantSelect#VariantSelect',
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
                      type: 'row',
                      fields: [
                        {
                          label: 'Product Active',
                          name: 'productActive',
                          type: 'checkbox',
                          defaultValue: true,
                          admin: {
                            description:
                              'Shows or hides the product from the shop. Default is true.',
                          },
                          required: true,
                        },
                        {
                          label: 'Sold Online',
                          name: 'soldOnline',
                          type: 'checkbox',
                          defaultValue: true,
                          admin: {
                            description: 'Allows the product to be sold online. Default is true.',
                          },
                          required: true,
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          label: 'Enable Inventory',
                          name: 'enableInventory',
                          type: 'checkbox',
                          admin: {
                            description:
                              'Check this if you want to track inventory for this product',
                          },
                          defaultValue: false,
                        },
                        {
                          label: 'Inventory',
                          name: 'inventory',
                          type: 'number',
                          admin: {
                            condition: (_, siblingData) => siblingData.enableInventory,
                            description:
                              'Define stock for this product. A stock of 0 disables checkout for this product.',
                          },
                          required: true,
                          defaultValue: 0,
                        },
                      ],
                    },
                    {
                      name: 'info',
                      type: 'json',
                      admin: {
                        hidden: true,
                        readOnly: true,
                      },
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
                  validate: (_, { siblingData }: { siblingData: any }) => {
                    if (siblingData.variantProducts.length) {
                      const hasDuplicate = siblingData.variantProducts.some(
                        (variant: ProductVariant, index) => {
                          // Check this against other variants
                          //@ts-ignore
                          const dedupedArray = [...siblingData.variantProducts].filter(
                            (_, i) => i !== index,
                          )

                          // Join the arrays then compare the strings, note that we sort the array before it's saved in the custom component
                          const test = dedupedArray.find((otherOption: ProductVariant) => {
                            const firstOption = otherOption?.options?.join('')
                            const secondOption = variant?.options?.join('')

                            return firstOption === secondOption
                          })

                          return Boolean(test)
                        },
                      )

                      if (hasDuplicate) {
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
      relationTo: PRODUCT_COLLECTION_SLUG,
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
      required: false,
      filterOptions: () => ({ isLeaf: { equals: true } }),
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      validate: async (value, { req: { payload } }) => {
        if (!value) return true

        const categories = await payload.find({
          collection: PRODUCT_CATEGORY_SLUG,
          where: {
            id: { in: value },
            isLeaf: { equals: true },
          },
        })

        // If the number of leaf categories does not match the number of selected values,
        // then at least one non-leaf category is being used.
        if (categories.totalDocs !== value.length) {
          return 'Products can only be added to leaf categories'
        }
        return true
      },
    },
    {
      name: 'compatibility',
      type: 'select',
      hasMany: true,
      required: false,
      options: [
        { label: 'SwimSpa', value: 'swimspa' },
        { label: 'Hot Tub', value: 'hottub' },
        { label: 'Pool', value: 'pool' },
      ],
      admin: {
        description: 'Select which equipment types this product is compatible with',
        position: 'sidebar',
      },
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
