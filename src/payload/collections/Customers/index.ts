import { CollectionConfig } from 'payload'
import { CART_SLUG, CUSTOMER_SLUG, ORDER_SLUG, USER_SLUG } from '../constants'
import { admins, anyone, authenticated } from '@payload/access'

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
      fields: [
        {
          name: 'company',
          type: 'text',
          required: true,
          label: 'Company',
        },
        {
          name: 'first_name',
          type: 'text',
          required: true,
          label: 'First Name',
        },
        {
          name: 'last_name',
          type: 'text',
          required: true,
          label: 'Last Name',
        },
        {
          name: 'line_1',
          type: 'text',
          required: true,
          label: 'Address Line 1',
        },
        {
          name: 'line_2',
          type: 'text',
          required: true,
          label: 'Address Line 2',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'City',
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          label: 'Country Code',
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          label: 'Province',
        },
        {
          name: 'postal_code',
          type: 'text',
          required: true,
          label: 'Postal Code',
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Phone',
        },
        {
          name: 'email',
          type: 'text',
          required: true,
          label: 'Email',
        },
        {
          name: 'metadata',
          type: 'json',
          label: 'Metadata',
        },
      ],
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
          name: 'company',
          type: 'text',
          required: true,
          label: 'Company',
        },
        {
          name: 'first_name',
          type: 'text',
          required: true,
          label: 'First Name',
        },
        {
          name: 'last_name',
          type: 'text',
          required: true,
          label: 'Last Name',
        },
        {
          name: 'line_1',
          type: 'text',
          required: true,
          label: 'Address Line 1',
        },
        {
          name: 'line_2',
          type: 'text',
          required: true,
          label: 'Address Line 2',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'City',
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          label: 'Country Code',
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          label: 'Province',
        },
        {
          name: 'postal_code',
          type: 'text',
          required: true,
          label: 'Postal Code',
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Phone',
        },
        {
          name: 'email',
          type: 'text',
          required: true,
          label: 'Email',
        },
        {
          name: 'metadata',
          type: 'json',
          label: 'Metadata',
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
