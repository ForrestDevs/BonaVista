import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/payload/access'
import { COLLECTION_SLUG_CATEGORIES } from '../constants'

export const Categories: CollectionConfig = {
  slug: COLLECTION_SLUG_CATEGORIES,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
} as const
