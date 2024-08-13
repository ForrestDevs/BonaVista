import type { Field } from 'payload'

import deepMerge from '../utilities/deepMerge'

type NavItemType = (options?: {
  overrides?: Record<string, unknown>
}) => Field

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
      relationTo: ['pages'],
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

  const groupLinkFields: Field[] = [
    {
      name: 'title',
      type: 'text',
      label: 'Link Title',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Link Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Link Image (optional)',
    },
    ...linkFields,
  ]

  const navItemResult: Field = {
    name: 'navItem',
    type: 'group',
    fields: [
      {
        name: 'type',
        type: 'radio',
        defaultValue: 'single',
        options: [
          {
            label: 'Single Link',
            value: 'single',
          },
          {
            label: 'Link Group',
            value: 'group',
          },
        ],
      },
      {
        name: 'singleLink',
        type: 'group',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'single',
        },
        fields: [
          {
            name: 'label',
            type: 'text',
            label: 'Label',
            required: true,
          },
          ...linkFields,
        ],
      },
      {
        name: 'linkGroup',
        type: 'group',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'group',
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Group Title',
            required: true,
          },
          {
            name: 'links',
            type: 'array',
            label: 'Links',
            minRows: 1,
            fields: groupLinkFields,
          },
        ],
      },
    ],
  }

  return deepMerge(navItemResult, overrides)
}
