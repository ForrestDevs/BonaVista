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
    preview: (doc) => `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/orders/${doc.id}`,
    useAsTitle: 'createdAt',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      admin: {
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
      // hooks: {
      //   beforeChange: [populateOrderedBy],
      // },
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
    {
      label: 'Items',
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
              hasMany: false,
              required: true,
            },
            {
              name: 'isVariant',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'variant',
              type: 'group',
              fields: [
                {
                  name: 'variantOptions',
                  type: 'array',
                  fields: [
                    {
                      name: 'key',
                      type: 'group',
                      fields: [
                        {
                          name: 'slug',
                          type: 'text',
                        },
                        {
                          name: 'label',
                          type: 'text',
                        },
                      ],
                    },
                    {
                      name: 'value',
                      type: 'group',
                      fields: [
                        {
                          name: 'slug',
                          type: 'text',
                        },
                        {
                          name: 'label',
                          type: 'text',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'id',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          admin: {
            step: 1,
          },
          min: 0,
          required: true,
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'thumbnailMediaId',
          type: 'upload',
          relationTo: 'media',
        },
      ],
      interfaceName: 'OrderItems',
    },
    {
      name: 'paymentIntent',
      type: 'json',
    },
  ],
  hooks: {
    // afterChange: [updateUserOrders, clearUserCart],
  },
} as const

export default Orders
