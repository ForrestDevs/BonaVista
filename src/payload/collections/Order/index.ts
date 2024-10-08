import type { CollectionConfig } from 'payload'
import { ORDER_SLUG, PRODUCT_SLUG, USER_SLUG } from '../constants'
import { admin, adminOrCurrentUser, adminsOrOrderedBy } from '@/payload/access'
import { updateUserPurchases } from './hooks/updateUserPurchases'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { LinkToPaymentIntent } from './ui/LinkToPaymentIntent'

export const Orders: CollectionConfig = {
  slug: ORDER_SLUG,
  access: {
    create: adminOrCurrentUser,
    delete: admin,
    read: adminsOrOrderedBy,
    update: admin,
  },
  admin: {
    group: "Shop",
    // useAsTitle: 'orderNumber',
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
      relationTo: USER_SLUG,
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
          Field: '@/payload/collections/Order/ui/LinkToPaymentIntent',
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
          relationTo: PRODUCT_SLUG,
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
