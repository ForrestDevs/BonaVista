import type { GlobalConfig } from 'payload'
import { SHOP_SETTINGS_SLUG } from '../constants'

export const ShopSettings: GlobalConfig = {
  slug: SHOP_SETTINGS_SLUG,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'currency',
      type: 'select',
      label: 'Currency',
      options: ['USD', 'EUR', 'GBP'],
    },
    {
      name: 'paymentMethods',
      type: 'array',
      label: 'Payment Methods',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enabled',
        },
      ],
    },
    {
      name: 'shippingMethods',
      type: 'array',
      label: 'Shipping Methods',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enabled',
        },
      ],
    },
  ],
} as const
