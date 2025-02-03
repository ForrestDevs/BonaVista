import type { CollectionConfig } from 'payload'
import { PRODUCT_COLLECTION_SLUG, PRODUCT_SLUG } from '../constants'
import { admin } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'

export const ProductCollection: CollectionConfig = {
  slug: PRODUCT_COLLECTION_SLUG,
  access: {
    create: admin,
    read: () => true,
    update: admin,
    delete: admin,
  },
  admin: {
    group: 'Shop',
    useAsTitle: 'title',
    defaultColumns: ['title'],
    preview: (doc) => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/store/collections/${doc.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  hooks: {
    // afterChange: [revalidateProduct],
    // afterDelete: [deleteProductFromCarts],
    // afterRead: [populateArchiveBlock],
    // beforeChange: [beforeProductChange],
  },
  versions: {
    drafts: true,
  },
  fields: [
    ...slugField(),
    {
      label: 'Title',
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'select',
      name: 'collectionType',
      options: [
        {
          label: 'Seasonal',
          value: 'seasonal',
        },
        {
          label: 'Promotional',
          value: 'promotional',
        },
        {
          label: 'Curated',
          value: 'curated',
        },
      ],
      required: true,
      admin: {
        description: 'The collection type determines how the products are displayed.',
      }
    },
    {
      label: 'Description',
      name: 'description',
      type: 'text',
    },
    {
      type: 'number',
      name: 'priority',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
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
  ],
  timestamps: true,
} as const

export default ProductCollection
