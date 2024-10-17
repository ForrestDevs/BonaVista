import type { CollectionConfig } from 'payload'
import { anyone, admins } from '@payload/access'
import { BRAND_SLUG } from '../constants'
import { slugField } from '@payload/fields/slug'

export const Brands: CollectionConfig = {
  slug: BRAND_SLUG,
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  fields: [
    slugField(),
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
} as const

export default Brands
