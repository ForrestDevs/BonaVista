import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@payload/access'
import { BLOG_CATEGORY_SLUG } from '../constants'

const BlogCategory: CollectionConfig = {
  slug: BLOG_CATEGORY_SLUG,
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

export default BlogCategory
