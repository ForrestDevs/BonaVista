import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from './linkGroup'
import { MEDIA_SLUG } from '../collections/constants'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'standard',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Standard',
          value: 'standard',
        },
        {
          label: 'Slider',
          value: 'slider',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Parallax',
          value: 'parallax',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      admin: {
        condition: (_, { type } = {}) =>
          ['parallax', 'highImpact', 'mediumImpact', 'lowImpact'].includes(type),
      },
      label: false,
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_, { type } = {}) =>
            ['parallax', 'highImpact', 'mediumImpact', 'lowImpact'].includes(type),
        },
        maxRows: 2,
      },
    }),
    {
      label: 'Hero Title',
      name: 'title',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => ['standard'].includes(type),
      },
    },
    {
      label: 'Hero Subtitle',
      name: 'subtitle',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => ['standard'].includes(type),
      },
    },
    {
      label: 'Hero Size',
      name: 'size',
      type: 'select',
      defaultValue: 'medium',
      options: ['large', 'medium', 'small'],
      admin: {
        condition: (_, { type } = {}) => ['standard'].includes(type),
      },
    },
    {
      label: 'Background Image',
      name: 'background',
      type: 'upload',
      relationTo: MEDIA_SLUG,
      admin: {
        condition: (_, { type } = {}) => ['standard'].includes(type),
      },
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: MEDIA_SLUG,
      required: true,
    },
    {
      name: 'slides',
      type: 'array',
      fields: [
        {
          name: 'pretitle',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
        },
        linkGroup({
          overrides: {
            maxRows: 1,
          },
        }),
        {
          name: 'background',
          type: 'upload',
          relationTo: MEDIA_SLUG,
        },
      ],
      admin: {
        condition: (_, { type } = {}) => ['slider'].includes(type),
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: (_, { type } = {}) => ['slider'].includes(type),
      },
    },
    {
      name: 'delay',
      type: 'number',
      admin: {
        condition: (_, { type } = {}) => ['slider'].includes(type),
      },
    },
    {
      name: 'fade',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: (_, { type } = {}) => ['slider'].includes(type),
      },
    },
  ],
  label: false,
}
