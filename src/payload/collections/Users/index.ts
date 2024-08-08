import type { CollectionConfig } from 'payload'
import { admins, authenticated } from '@/payload/access'
import { COLLECTION_SLUG_USERS } from '../constants'
import { CustomerSelect } from './ui/CustomerSelect'
import { resolveDuplicatePurchases } from './hooks/resolveDuplicatePurchases'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { createStripeCustomer } from './hooks/createStripeCustomer'
import { customerProxy } from './endpoints/customer'

export const Users: CollectionConfig = {
  slug: COLLECTION_SLUG_USERS,
  admin: {
    group: "Admin",
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  hooks: {
    afterChange: [loginAfterCreate],
    beforeChange: [createStripeCustomer],
  },
  endpoints: [
    {
      handler: customerProxy,
      method: 'get',
      path: '/:teamID/customer',
    },
    {
      handler: customerProxy,
      method: 'patch',
      path: '/:teamID/customer',
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Customer',
          value: 'customer',
        },
      ],
      defaultValue: 'customer',
      hasMany: true,
      index: true,
      saveToJWT: true,
      required: true,
    },
    {
      name: 'purchases',
      type: 'relationship',
      hasMany: true,
      hooks: {
        beforeChange: [resolveDuplicatePurchases],
      },
      label: 'Purchases',
      relationTo: 'products',
    },
    {
      name: 'stripeCustomerID',
      type: 'text',
      access: {
        read: admins,
      },
      admin: {
        components: {
          Field: CustomerSelect,
        },
        position: 'sidebar',
      },
      label: 'Stripe Customer',
    },
    {
      name: 'cart',
      type: 'group',
      fields: [
        {
          name: 'items',
          type: 'array',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
            },
            {
              name: 'quantity',
              type: 'number',
              admin: {
                step: 1,
              },
              min: 0,
            },
          ],
          interfaceName: 'CartItems',
          label: 'Items',
        },
        {
          name: 'createdOn',
          label: 'Created On',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'lastModified',
          label: 'Last Modified',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
      label: 'Cart',
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
  ],
  timestamps: true,
} as const
