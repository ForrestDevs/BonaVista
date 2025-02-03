import { CollectionConfig } from 'payload'
import { ADDRESS_SLUG, CART_SLUG, CUSTOMER_SLUG, ORDER_SLUG, USER_SLUG } from '../constants'
import { admins, anyone, authenticated } from '@payload/access'
// import { customerProxy } from './endpoints/customer'
import { createStripeCustomer } from './hooks/createStripeCustomer'

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
    group: 'Shop',
    useAsTitle: 'email',
  },
  endpoints: [
    // {
    //   handler: customerProxy,
    //   method: 'get',
    //   path: '/:teamID/customer',
    // },
    // {
    //   handler: customerProxy,
    //   method: 'patch',
    //   path: '/:teamID/customer',
    // },
  ],
  hooks: {
    beforeChange: [createStripeCustomer],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
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
      name: 'skipSync',
      type: 'checkbox',
      admin: {
        hidden: true,
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Skip Sync',
    },
    {
      label: 'Billing Address',
      name: 'billing_address',
      type: 'json',
    },
    {
      label: {
        singular: 'Shipping Address',
        plural: 'Shipping Addresses',
      },
      name: 'shipping_addresses',
      type: 'array',
      fields: [
        {
          name: 'address',
          type: 'json',
        },
      ],
    },
    {
      name: 'orders',
      type: 'relationship',
      access: {
        create: admins,
        update: admins,
      },
      hasMany: true,
      label: 'Orders',
      relationTo: ORDER_SLUG,
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
