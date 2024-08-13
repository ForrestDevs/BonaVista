import type { GlobalConfig } from 'payload'

import { link } from '../../fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { linkGroup } from '@/payload/fields/linkGroup'
import Edit from './ui/edit'
import { navItem } from '@/payload/fields/nav-item'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        navItem(),
        // link({
        //   appearances: false,
        // }),
        // linkGroup({
        //   appearances: false,
        // }),
      ],
      maxRows: 6,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
