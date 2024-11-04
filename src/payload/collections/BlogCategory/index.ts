import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@payload/access'
import { BLOG_CATEGORY_SLUG } from '../constants'
import { slugField } from '@/payload/fields/slug'

const BlogCategory: CollectionConfig = {
  slug: BLOG_CATEGORY_SLUG,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Blog',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'showInFilter',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField()
  ],
} as const

export default BlogCategory
