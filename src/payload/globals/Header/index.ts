import type { GlobalConfig } from 'payload'

import { link } from '../../fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { navItem } from '@/payload/fields/nav-item'
import { HEADER_SLUG } from '../constants'
import { createRowLabel } from '@/components/payload/AdminViews/RowLabels/create-row-label'

export const Header: GlobalConfig = {
  slug: HEADER_SLUG,
  admin: {
    group: 'Website',
  },
  access: {
    read: () => true,
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
