import type { CollectionConfig } from 'payload'
import { anyone, admins } from '@payload/access'
import { SPA_SLUG } from '../constants'
import { slugField } from '@payload/fields/slug'

export const Spas: CollectionConfig = {
  slug: SPA_SLUG,
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  fields: [
    slugField(),
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Hot Tub', value: 'hot_tub' },
        { label: 'Swim Spa', value: 'swim_spa' },
      ],
      required: true,
    },
    {
      name: 'family',
      type: 'select',
      options: [
        { label: 'Self-Cleaning', value: 'self-cleaning' },
        { label: 'Serenity', value: 'serenity' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
        },
      ],
    },
    {
      name: 'seats',
      type: 'number',
    },
    {
      name: 'jets',
      type: 'number',
    },
    {
      name: 'dimensions',
      type: 'group',
      fields: [
        { name: 'length', type: 'number' },
        { name: 'width', type: 'number' },
        { name: 'height', type: 'number' },
      ],
    },
    {
      name: 'waterCapacity',
      type: 'number',
      label: 'Water Capacity (gallons)',
    },
    {
      name: 'weightFull',
      type: 'number',
      label: 'Weight When Full (lbs)',
    },
    {
      name: 'weightDry',
      type: 'number',
      label: 'Weight When Dry (lbs)',
    },
    {
      name: 'additionalInformation',
      type: 'array',
      fields: [
        {
          name: 'key',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
      ],
    },
    {
      name: 'detailsLink',
      type: 'text',
      label: 'Link to More Details',
    },
    {
      name: 'quoteLink',
      type: 'text',
      label: 'Link to Get a Quote',
    },
    {
      name: 'financingLink',
      type: 'text',
      label: 'Link to Apply for Financing',
    },
  ],
} as const

export default Spas
