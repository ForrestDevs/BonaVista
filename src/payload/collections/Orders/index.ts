import type { CollectionConfig } from 'payload'

import { adminOrCurrentUser, admins, adminsOrOrderedByOrPaymentId } from '@payload/access'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { updateUserOrders } from './hooks/updateUserOrders'
import { CUSTOMER_SLUG } from '../constants'
import { lineItems } from '@/payload/fields/line-items'

const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: adminOrCurrentUser,
    delete: admins,
    read: adminsOrOrderedByOrPaymentId,
    update: admins,
  },
  admin: {
    group: 'Ecommerce',
    defaultColumns: ['createdAt', 'orderedBy'],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/orders/${doc.id}`,
    useAsTitle: 'createdAt',
  },
  fields: [
    {
      label: 'Order Number',
      name: 'orderNumber',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        'canceled',
        'processing',
        'requires_action',
        'requires_capture',
        'requires_confirmation',
        'requires_payment_method',
        'succeeded',
      ],
      defaultValue: 'requires_action',
    },
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: CUSTOMER_SLUG,
      hasMany: false,
    },
    {
      name: 'stripePaymentIntentID',
      type: 'text',
      admin: {
        components: {
          Field: 'src/payload/collections/Orders/ui/LinkToPaymentIntent',
          // Field: LinkToPaymentIntent,
        },
        position: 'sidebar',
      },
      label: 'Stripe Payment Intent ID',
    },
    {
      name: 'shippingRate',
      type: 'group',
      fields: [
        {
          name: 'displayName',
          type: 'text',
        },
        {
          name: 'rate',
          type: 'number',
        },
      ],
      admin: {
        position: 'sidebar',
      },
      label: 'Shipping Rate',
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
          name: 'taxTotal',
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
    lineItems(),
    {
      name: 'paymentIntent',
      type: 'json',
    },
  ],
  hooks: {
    // afterChange: [updateUserOrders, clearUserCart],
  },
  timestamps: true,
} as const

export default Orders
