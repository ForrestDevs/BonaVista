import { revalidateTag } from 'next/cache'
import type { GlobalConfig } from 'payload'
import { STORE_HOURS_SLUG } from '../constants'
import { createRowLabel } from '@/components/payload/AdminViews/RowLabels/create-row-label'

export const StoreHours: GlobalConfig = {
  slug: STORE_HOURS_SLUG,
  access: {
    read: () => true,
  },
  admin: {
    group: 'Admin',
  },
  hooks: {
    afterChange: [async () => revalidateTag('global_store-hours')],
  },
  fields: [
    {
      name: 'days',
      type: 'array',
      required: true,
      admin: {
        description: 'Configure store hours for each day of the week',
        initCollapsed: true,
        components: {
          RowLabel: createRowLabel({
            defaultLabel: {
              en: 'Day of Week',
            },
            path: 'dayOfWeek',
          }),
        },
      },
      fields: [
        {
          name: 'dayOfWeek',
          type: 'select',
          required: true,
          options: [
            { label: 'Monday', value: 'Monday' },
            { label: 'Tuesday', value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday', value: 'Thursday' },
            { label: 'Friday', value: 'Friday' },
            { label: 'Saturday', value: 'Saturday' },
            { label: 'Sunday', value: 'Sunday' },
          ],
          unique: true,
        },
        {
          name: 'isClosed',
          type: 'checkbox',
          label: 'Closed',
          defaultValue: false,
        },
        {
          name: 'openTime',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            condition: (data, siblingData) => !siblingData.isClosed,
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'h:mm:ss a',
            },
          },
        },
        {
          name: 'closeTime',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            condition: (data, siblingData) => !siblingData.isClosed,
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'h:mm:ss a',
            },
          },
        },
      ],
    },
  ],
  typescript: {
    interface: 'StoreHours',
  },
} as const
