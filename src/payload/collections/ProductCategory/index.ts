import type { CollectionConfig } from 'payload'
import { admin, anyone, authenticated } from '@/payload/access'
import { PRODUCT_CATEGORY_SLUG } from '../constants'
import { PRODUCT_SLUG } from '../constants'
import { slugField } from '@/payload/fields/slug'

export const ProductCategory: CollectionConfig = {
  slug: PRODUCT_CATEGORY_SLUG,
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
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/store/categories/${doc.slug}`,
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
    slugField(),
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      label: 'Description',
      name: 'description',
      type: 'text',
    },
  ],
  timestamps: true,
} as const
