import type { CollectionConfig } from 'payload'
import { COLLECTION_SLUG_ORDERS } from '../constants'
import { admin, adminOrCurrentUser, adminsOrOrderedBy } from '@/payload/access'
import { updateUserPurchases } from './hooks/updateUserPurchases'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { LinkToPaymentIntent } from './ui/LinkToPaymentIntent'

export const Orders: CollectionConfig = {
  slug: COLLECTION_SLUG_ORDERS,
  access: {
    create: adminOrCurrentUser,
    delete: admin,
    read: adminsOrOrderedBy,
    update: admin,
  },
  admin: {
    group: "Shop",
    useAsTitle: 'orderNumber',
    defaultColumns: [],
    preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
  },
  hooks: {
    afterChange: [updateUserPurchases, clearUserCart],
  },
  fields: [
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      hooks: {
        beforeChange: [populateOrderedBy],
      },
    },
    {
      name: 'stripePaymentIntentID',
      type: 'text',
      label: 'Stripe Payment Intent ID',
      admin: {
        components: {
          Field: LinkToPaymentIntent,
        },
        position: 'sidebar',
      },
    },
    {
      name: 'total',
      type: 'number',
      min: 0,
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 0,
        },
      ],
    },
  ],
} as const
