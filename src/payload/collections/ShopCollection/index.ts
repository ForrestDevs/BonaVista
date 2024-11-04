import type { CollectionConfig } from 'payload'
import { SHOP_COLLECTION_SLUG } from '@payload/collections/constants'
import { admin } from '@payload/access'
import { slugField } from '@payload/fields/slug'

const ShopCollection: CollectionConfig = {
  slug: SHOP_COLLECTION_SLUG,
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
      label: 'Description',
      name: 'description',
      type: 'text',
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

export default ShopCollection
