import type { CollectionConfig } from 'payload'
import { slugField } from '@/payload/fields/slug'
import { POST_TAG_SLUG } from '../constants'

export const PostTag: CollectionConfig = {
  slug: POST_TAG_SLUG,
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: "Content",
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'updatedAt', 'createdAt'],
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 10,
  },
  fields: [
    slugField(),
    {
      name: 'title',
      label: 'Title',
      type: 'select',
      options: [
        { label: 'Ayurveda', value: 'Ayurveda' },
        { label: 'Yoga', value: 'Yoga' },
        { label: 'Blog', value: 'Blog' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        condition: (data) => data.title === 'Yoga' || data.title === 'Ayurveda',
      },
    },
    {
      type: 'text',
      label: 'Description',
      name: 'description',
      admin: {
        condition: (data) => data.title === 'Yoga' || data.title === 'Ayurveda',
      },
    },
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          label: 'Button Name',
          name: 'button_name',
          admin: {
            condition: (data) => data.title === 'Yoga' || data.title === 'Ayurveda',
          },
        },
        {
          type: 'text',
          label: 'Button Link',
          name: 'button_link',
          admin: {
            condition: (data) => data.title === 'Yoga' || data.title === 'Ayurveda',
          },
        },
      ],
    },
  ],
} as const
