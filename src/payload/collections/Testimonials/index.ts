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
      label: 'Description',
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      label: 'Reviewer',
      name: 'reviewer',
      type: 'text',
      required: true,
    },
  ],
} as const

export default Testimonials
