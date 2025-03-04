import type { CollectionConfig } from 'payload'

import { adminOrCurrentUser, admins, adminsOrOrderedByOrPaymentId } from '@payload/access'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { updateUserOrders } from './hooks/updateUserOrders'
import { CUSTOMER_SLUG, SHIPPING_OPTION_SLUG } from '../constants'
import { lineItems } from '@/payload/fields/line-items'
import { address } from '@/payload/fields/address'

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
      options: ['processing', 'ready_for_pickup', 'shipped', 'succeeded', 'canceled'],
      defaultValue: 'processing',
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
        },
        position: 'sidebar',
      },
      label: 'Stripe Payment Intent ID',
    },
    {
      name: 'deliveryType',
      type: 'select',
      options: ['pickup', 'shipping'],
      defaultValue: 'pickup',
      admin: {
        position: 'sidebar',
      },
      label: 'Delivery Type',
    },
    {
      name: 'shippingDetails',
      label: 'Shipping Details',
      type: 'group',
      admin: {
        condition: (data) => data.deliveryType === 'shipping',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
        },
        address({
          overrides: {
            name: 'shipTo',
            label: 'Ship To',
          },
        }),
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          min: 0,
          required: true,
        },
        {
          name: 'shippingTotal',
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
    lineItems({
      overrides: {
        label: 'Products',
      },
    }),
    {
      name: 'paymentIntent',
      type: 'json',
    },
  ],
  timestamps: true,
} as const

export default Orders
