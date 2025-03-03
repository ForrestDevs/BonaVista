import type { GlobalConfig } from 'payload'
import { revalidateHeader } from './hooks/revalidateHeader'
import { navItem } from '@/payload/fields/nav-item'
import { HEADER_SLUG } from '../constants'
import { createRowLabel } from '@/components/payload/AdminViews/RowLabels/create-row-label'
import { admin, admins, anyone } from '@/payload/access'

export const Header: GlobalConfig = {
  slug: HEADER_SLUG,
  admin: {
    group: 'Website',
  },
  access: {
    read: anyone,
    update: admin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'site',
          label: 'Site Header',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [navItem()],
              maxRows: 6,
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: createRowLabel({
                    defaultLabel: {
                      en: 'Item',
                    },
                    path: 'item.label',
                  }),
                },
              },
            },
          ],
        },
        {
          name: 'shop',
          label: 'Shop Header',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [navItem()],
              maxRows: 6,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
