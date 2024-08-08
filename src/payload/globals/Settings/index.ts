import { revalidateTag } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [async () => revalidateTag('settings')],
  },
  fields: [
    {
      name: 'productsPage',
      type: 'relationship',
      label: 'Products page',
      relationTo: 'pages',
    },
    {
      type: 'tabs',
      label: 'Settings',
      tabs: [
        {
          name: 'general',
          label: 'General',
          fields: [
            {
              type: 'text',
              name: 'appName',
              admin: { description: 'Enter your app name' },
            },
            {
              type: 'text',
              name: 'appDescription',
              admin: { description: 'Enter your app description' },
            },
          ],
        },
        {
          name: 'admin',
          label: 'Admin',
          fields: [
            {
              type: 'email',
              name: 'email',
              label: 'Admin Email',
              admin: {
                description: 'Enter admin email to receive mails from users.',
              },
            },
            {
              type: 'number',
              name: 'phone_number',
              label: 'Admin Phone Number',
              admin: { description: 'Enter admin phone number' },
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    name: 'Settings',
  },
  typescript: {
    interface: 'Settings',
  },
}
