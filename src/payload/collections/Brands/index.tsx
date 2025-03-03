import type { CollectionConfig } from 'payload'
import { anyone, admins } from '@payload/access'
import { BRAND_SLUG, PRODUCT_SLUG } from '../constants'
import { slugField } from '@payload/fields/slug'

export const Brands: CollectionConfig = {
  slug: BRAND_SLUG,
  admin: {
    group: 'Ecommerce',
    useAsTitle: 'name',
  },
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  fields: [
    ...slugField('name'),
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'products',
      type: 'join',
      collection: PRODUCT_SLUG,
      on: 'brand',
      label: 'Products',
      admin: {
        position: 'sidebar',
        allowCreate: false,
        defaultColumns: ['title'],
      },
    },
  ],
} as const

export default Brands
