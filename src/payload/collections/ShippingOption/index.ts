import { CollectionConfig } from 'payload'
import { SHIPPING_OPTION_SLUG } from '../constants'
import { address } from '@/payload/fields/address'

const ShippingOptions: CollectionConfig = {
  slug: SHIPPING_OPTION_SLUG,
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'In-Store Pickup',
          value: 'pickup',
        },
        {
          label: 'Shipping',
          value: 'shipping',
        },
      ],
    },
    {
      name: 'shippingRules',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'shipping',
      },
      fields: [
        {
          name: 'baseRate',
          type: 'number',
          required: true,
          label: 'Base Shipping Rate',
        },
        {
          name: 'freeShippingThreshold',
          type: 'number',
          label: 'Free Shipping Order Threshold (Optional)',
        },
        {
          name: 'regions',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'postalCodePattern',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Enter a regex pattern to match postal codes. Example: For GTA use: ^[MmLl][0-9][A-Za-z]',
              },
            },
          ],
        },
      ],
    },
    address({
      overrides: {
        name: 'pickupLocation',
        admin: {
          condition: (data) => data.type === 'pickup',
        },
      },
    }),
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
  ],
  timestamps: true,
} as const

export default ShippingOptions
