import { CollectionConfig } from 'payload'
import { admins, anyone } from '@payload/access'
import { CART_SLUG, ADDRESS_SLUG, CUSTOMER_SLUG } from '../constants'
import Stripe from 'stripe'

const Cart: CollectionConfig = {
  slug: CART_SLUG,
  access: {
    create: anyone,
    read: anyone,
    update: admins,
    delete: admins,
  },
  admin: {
    group: 'Ecommerce',
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: CUSTOMER_SLUG,
      hasMany: false,
    },
    {
      label: 'Items',
      name: 'items',
      type: 'array',
      interfaceName: 'CartItems',
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
              name: 'variantId',
              type: 'number',
            },
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
      ],
    },
    {
      name: 'payment_intent',
      type: 'json',
    },
    {
      name: 'checkout_session',
      type: 'json',
    },
    {
      name: 'taxCalculationId',
      type: 'text',
    },
    {
      name: 'completed_at',
      type: 'date',
    },
    {
      name: 'payment_authorized_at',
      type: 'date',
    },
    {
      name: 'metadata',
      type: 'json',
    },
    {
      name: 'payment',
      type: 'json',
    },
    {
      name: 'discount_total',
      type: 'number',
    },
    {
      name: 'subtotal',
      type: 'number',
    },
  ],
}

export default Cart
