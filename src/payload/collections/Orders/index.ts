import type { CollectionConfig } from 'payload'

import { adminOrCurrentUser, admins, adminsOrOrderedByOrPaymentId } from '@payload/access'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { updateUserOrders } from './hooks/updateUserOrders'
import { CUSTOMER_SLUG } from '../constants'

const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: adminOrCurrentUser,
    delete: admins,
    read: adminsOrOrderedByOrPaymentId,
    update: admins,
  },
  admin: {
    group: 'Shop',
    defaultColumns: ['createdAt', 'orderedBy'],
    preview: (doc) => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
    useAsTitle: 'createdAt',
  },
  fields: [
    {
      name: 'orderedBy',
      type: 'relationship',
      // hooks: {
      //   beforeChange: [populateOrderedBy],
      // },
      relationTo: CUSTOMER_SLUG,
    },
    {
      name: 'stripePaymentIntentID',
      type: 'text',
      admin: {
        components: {
          Field: "src/payload/collections/Orders/ui/LinkToPaymentIntent"
          // Field: LinkToPaymentIntent,
        },
        position: 'sidebar',
      },
      label: 'Stripe Payment Intent ID',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'total',
          type: 'number',
          min: 0,
          required: true,
        },
        {
          name: 'currency',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
              required: true,
            },
            {
              name: 'variant',
              type: 'text',
            },
          ],
        },
        {
          name: 'quantity',
          type: 'number',
          min: 0,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [updateUserOrders, clearUserCart],
  },
} as const

export default Orders
