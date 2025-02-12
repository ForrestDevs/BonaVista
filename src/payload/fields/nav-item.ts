import type { Field } from 'payload'

import deepMerge from '../../lib/utils/deepMerge'
import { MEDIA_SLUG, PAGE_SLUG } from '../collections/constants'
import { createRowLabel } from '@/components/payload/AdminViews/RowLabels/create-row-label'

type NavItemType = (options?: { overrides?: Record<string, unknown> }) => Field

export const navItem: NavItemType = ({ overrides = {} } = {}) => {
  const linkFields: Field[] = [
    {
      name: 'type',
      type: 'radio',
      admin: {
        layout: 'horizontal',
      },
      defaultValue: 'reference',
      options: [
        {
          label: 'Internal link',
          value: 'reference',
        },
        {
          label: 'Custom URL',
          value: 'custom',
        },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      maxDepth: 1,
      relationTo: [PAGE_SLUG],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
    },
  ]

  const navItemResult: Field = {
    name: 'item',
    type: 'group',
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'isLink',
        type: 'checkbox',
        label: 'Is Link',
        defaultValue: false,
      },
      {
        name: 'link',
        type: 'group',
        label: 'Link',
        fields: linkFields,
        admin: {
          condition: (_, siblingData) => siblingData?.isLink,
        },
      },
      {
        label: 'Submenu Items',
        labels: {
          singular: 'Submenu Item',
          plural: 'Submenu Items',
        },
        name: 'submenu',
        type: 'array',
        fields: [
          {
            name: 'label',
            type: 'text',
            required: true,
          },
          {
            name: 'isLink',
            type: 'checkbox',
            label: 'Is Link',
            defaultValue: false,
          },
          {
            name: 'link',
            type: 'group',
            label: 'Link',
            fields: linkFields,
            admin: {
              condition: (_, siblingData) => siblingData?.isLink,
            },
          },
          {
            labels: {
              singular: 'Sublink',
              plural: 'Sublinks',
            },
            name: 'links',
            type: 'array',
            fields: [
              {
                name: 'label',
                type: 'text',
                required: true,
              },
              ...linkFields,
            ],
            admin: {
              initCollapsed: true,
              components: {
                RowLabel: createRowLabel({
                  defaultLabel: {
                    en: 'Submenu',
                  },
                  path: 'label',
                }),
              },
            },
          },
        ],
        admin: {
          condition: (_, siblingData) => !siblingData?.isLink,
          initCollapsed: true,
          components: {
            RowLabel: createRowLabel({
              defaultLabel: {
                en: 'Submenu',
              },
              path: 'label',
            }),
          },
        },
      },
    ],
  }

  return deepMerge(navItemResult, overrides)
}
