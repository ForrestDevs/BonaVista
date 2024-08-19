import type { CollectionConfig } from 'payload'
import { PRODUCT_CATEGORY_SLUG, PRODUCT_SLUG } from '../constants'
import { admin } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'
import { revalidateProduct } from './hooks/revalidateProduct'
import { deleteProductFromCarts } from './hooks/deleteProductFromCart'
import { beforeProductChange } from './hooks/beforeChange'
import { CallToAction } from '@/payload/blocks/CallToAction'
import { MediaBlock } from '@/payload/blocks/MediaBlock'
import { Archive } from '@/payload/blocks/ArchiveBlock'
import { ProductSelect } from './ui/ProductSelect'
import { checkUserPurchases } from './access/checkUserPurchases'
import { PriceSelect } from './ui/PriceSelect'
import { PRODUCT_COLLECTION_SLUG } from '../constants'

export const Product: CollectionConfig = {
  slug: PRODUCT_SLUG,
  access: {
    create: admin,
    read: () => true,
    update: admin,
    delete: admin,
  },
  admin: {
    group: 'Shop',
    useAsTitle: 'title',
    defaultColumns: ['title', 'description', 'stripeProductID', '_status'],
    preview: (doc) => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  hooks: {
    afterChange: [revalidateProduct],
    afterDelete: [deleteProductFromCarts],
    // afterRead: [populateArchiveBlock],
    beforeChange: [beforeProductChange],
  },
  versions: {
    drafts: true,
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
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      label: 'Images',
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
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
      name: 'categories',
      type: 'relationship',
      relationTo: PRODUCT_CATEGORY_SLUG,
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'collections',
      type: 'relationship',
      relationTo: PRODUCT_COLLECTION_SLUG,
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, MediaBlock, Archive],
              required: true,
            },
            {
              name: 'enablePaywall',
              type: 'checkbox',
              label: 'Enable Paywall',
            },
            {
              name: 'paywall',
              type: 'blocks',
              access: {
                read: checkUserPurchases,
              },
              blocks: [CallToAction, MediaBlock, Archive],
              label: 'Paywall',
            },
          ],
        },
        {
          label: 'Stripe',
          fields: [
            {
              label: 'Stripe Product Object',
              name: 'stripeProductID',
              type: 'text',
              admin: {
                components: {
                  Field: ProductSelect,
                },
              },
            },
            {
              label: 'Price JSON',
              name: 'priceJSON',
              type: 'textarea',
              admin: {
                readOnly: true,
                rows: 10,
              },
            },
            {
              name: 'skipSync',
              type: 'checkbox',
              label: 'Skip Sync',
              admin: {
                hidden: true,
                position: 'sidebar',
                readOnly: true,
              },
            },
          ],
        },
        {
          label: 'Variants',
          fields: [
            {
              label: 'Has Variants',
              name: 'hasVariants',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              label: 'Variants',
              name: 'variants',
              type: 'array',
              interfaceName: 'ProductVariants',
              admin: {
                condition: (_, siblingData) => siblingData.hasVariants,
              },
              fields: [
                {
                  label: 'Stripe Price Object',
                  name: 'stripePriceID',
                  type: 'text',
                  admin: {
                    components: {
                      Field: PriceSelect,
                    },
                  },
                },
                {
                  label: 'Price Object Json',
                  name: 'priceJSON',
                  type: 'textarea',
                  admin: {
                    readOnly: true,
                    rows: 10,
                  },
                },
                {
                  label: 'Use Parent Product Meta',
                  name: 'useParentMeta',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  label: 'Title',
                  name: 'title',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => !siblingData.useParentMeta,
                  },
                },
                {
                  label: 'Description',
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    condition: (_, siblingData) => !siblingData.useParentMeta,
                  },
                },
                {
                  label: 'Images',
                  name: 'images',
                  type: 'array',
                  admin: {
                    condition: (_, siblingData) => !siblingData.useParentMeta,
                  },
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
          ],
        },
      ],
    },
  ],
  timestamps: true,
} as const
