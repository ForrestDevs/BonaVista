import type { CollectionConfig } from 'payload'
import { anyone, admins, authenticated } from '@payload/access'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { CUSTOMER_SLUG, USER_SLUG } from '../constants'

const Users: CollectionConfig = {
  slug: USER_SLUG,
  access: {
    admin: admins,
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    group: 'Admin',
  },
  auth: {
    verify: true,
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        read: admins,
        update: admins,
      },
      defaultValue: ['customer'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: CUSTOMER_SLUG,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
} as const

export default Users
