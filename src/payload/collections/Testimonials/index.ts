import type { CollectionConfig } from 'payload'
import { authenticated } from '@payload/access'
import { TESTIMONIALS_SLUG } from '../constants'

const Testimonials: CollectionConfig = {
  slug: TESTIMONIALS_SLUG,
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      label: 'Title',
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      label: 'Content',
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      label: 'Author',
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      label: 'Rating',
      name: 'rating',
      type: 'number',
      required: true,
    },
    {
      label: 'Date',
      name: 'date',
      type: 'date',
      required: true,
    },
  ],
} as const

export default Testimonials
