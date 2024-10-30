import type { Block } from 'payload'
import { CARD_BLOCK_SLUG } from '../constants'

export const iconOptions = [
  {
    label: 'Moon',
    value: 'moon',
  },
  {
    label: 'Heart Eyes',
    value: 'heart-eyes',
  },
  {
    label: 'Swimming',
    value: 'swimming',
  },
  {
    label: 'Walking',
    value: 'walking',
  },
  {
    label: 'Wave',
    value: 'wave',
  },
  {
    label: 'Theater Masks',
    value: 'theater-masks',
  },
  {
    label: 'Heart',
    value: 'heart',
  },
  {
    label: 'Sleeping',
    value: 'sleeping',
  },
  {
    label: 'Stress',
    value: 'stress',
  },
  {
    label: 'Aches',
    value: 'aches',
  },
  {
    label: 'Sick',
    value: 'sick',
  },
]

export const Card: Block = {
  slug: CARD_BLOCK_SLUG,
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'icon',
      options: [
        {
          label: 'Icon',
          value: 'icon',
        },
        {
          label: 'Product',
          value: 'product',
        },
        {
          label: 'Service',
          value: 'service',
        },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      options: iconOptions,
    //   admin: {
    //     condition: (data) => data.type === 'icon',
    //   },
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
  interfaceName: 'CardBlock',
}
