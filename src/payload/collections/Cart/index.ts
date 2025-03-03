import { CollectionConfig } from 'payload'
import { admins, anyone } from '@payload/access'
import { CART_SLUG, ADDRESS_SLUG, CUSTOMER_SLUG } from '../constants'
import Stripe from 'stripe'
import { lineItems } from '@/payload/fields/line-items'

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
    lineItems(),
    {
      name: 'customer',
      type: 'relationship',
      relationTo: CUSTOMER_SLUG,
      hasMany: false,
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
  timestamps: true,
}

export default Cart
