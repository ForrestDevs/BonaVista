import { CollectionConfig } from 'payload'
import { CART_SLUG, CUSTOMER_SLUG, ORDER_SLUG, USER_SLUG } from '../constants'
import { admins, anyone, authenticated } from '@payload/access'
import { address } from '@/payload/fields/address'

const Customers: CollectionConfig = {
  slug: CUSTOMER_SLUG,
  access: {
    admin: admins,
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Ecommerce',
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'has_account',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the customer is a registered user',
      },
    },
    {
      name: 'account',
      type: 'relationship',
      relationTo: USER_SLUG,
      admin: {
        condition: (data) => data.has_account,
      },
    },
    {
      name: 'stripeCustomerID',
      type: 'text',
      access: {
        read: admins,
        update: admins,
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Stripe Customer',
    },
    {
      name: 'cart',
      type: 'relationship',
      relationTo: CART_SLUG,
      hasMany: false,
    },
    {
      label: {
        singular: 'Billing Address',
        plural: 'Billing Addresses',
      },
      name: 'billing_addresses',
      type: 'array',
      fields: [address()],
    },
    {
      label: {
        singular: 'Shipping Address',
        plural: 'Shipping Addresses',
      },
      name: 'shipping_addresses',
      type: 'array',
      fields: [address()],
    },
    {
      label: 'Orders',
      name: 'orders',
      relationTo: ORDER_SLUG,
      type: 'relationship',
      access: {
        create: admins,
        update: admins,
      },
      hasMany: true,
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'An optional key-value map with additional details',
      },
    },
  ],
} as const

export default Customers
