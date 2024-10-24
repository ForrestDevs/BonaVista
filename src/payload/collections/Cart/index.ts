import { CollectionConfig } from 'payload'
import { admins, anyone } from '@payload/access'
import { CART_SLUG, ADDRESS_SLUG, CUSTOMER_SLUG } from '../constants'

const Cart: CollectionConfig = {
  slug: CART_SLUG,
  access: {
    create: anyone,
    read: anyone,
    update: admins,
    delete: admins,
  },
  admin: {
    group: 'Shop',
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
      name: 'billing_address',
      type: 'relationship',
      relationTo: ADDRESS_SLUG,
      hasMany: false,
    },
    {
      name: 'shipping_address',
      type: 'relationship',
      relationTo: ADDRESS_SLUG,
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
          admin: {
            step: 1,
          },
          min: 0,
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'payment_id',
      type: 'text',
    },
    {
      name: 'payment_session',
      type: 'json',
    },
    {
      name: 'payment_sessions',
      type: 'array',
      fields: [
        {
          name: 'provider',
          type: 'text',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Authorized', value: 'authorized' },
            { label: 'Requires More', value: 'requires_more' },
            { label: 'Error', value: 'error' },
            { label: 'Canceled', value: 'canceled' },
          ],
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Swap', value: 'swap' },
        { label: 'Draft Order', value: 'draft_order' },
        { label: 'Payment Link', value: 'payment_link' },
        { label: 'Claim', value: 'claim' },
      ],
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
      name: 'shipping_total',
      type: 'number',
    },
    {
      name: 'discount_total',
      type: 'number',
    },
    {
      name: 'raw_discount_total',
      type: 'number',
    },
    {
      name: 'item_tax_total',
      type: 'number',
    },
    {
      name: 'shipping_tax_total',
      type: 'number',
    },
    {
      name: 'tax_total',
      type: 'number',
    },
    {
      name: 'refunded_total',
      type: 'number',
    },
    {
      name: 'total',
      type: 'number',
    },
    {
      name: 'subtotal',
      type: 'number',
    },
  ],
}

export default Cart
