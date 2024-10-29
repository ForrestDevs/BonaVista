import type { Block } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  lexicalEditor,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import { TYPOGRAPHY_BLOCK_SLUG } from '@payload/blocks/constants'
import { linkGroup } from '@/payload/fields/linkGroup'
import { colorSwatchField } from '@/payload/fields/color'

const typographyOptions = [
  { label: 'Sub, Title, Body', value: 'sub-title-body' },
  { label: 'Title, Body', value: 'title-body' },
  { label: 'Title', value: 'title' },
  { label: 'Subtitle', value: 'subtitle' },
  { label: 'Body', value: 'body' },
]

export const Typography: Block = {
  slug: TYPOGRAPHY_BLOCK_SLUG,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Options',
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'sub-title-body',
              options: typographyOptions,
            },
            {
              name: 'enableLinks',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'align',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: {
                condition: (_, { type } = {}) =>
                  ['sub-title-body', 'title-body', 'title'].includes(type),
              },
            },
            {
              name: 'subTitle',
              type: 'text',
              admin: {
                condition: (_, { type } = {}) => ['sub-title-body', 'subtitle'].includes(type),
              },
            },
            {
              name: 'body',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
              }),
              admin: {
                condition: (_, { type } = {}) =>
                  ['sub-title-body', 'title-body', 'body'].includes(type),
              },
            },
            linkGroup({
              appearances: ['default', 'secondary', 'none'],
              overrides: {
                admin: {
                  condition: (_, { enableLinks } = {}) => enableLinks,
                },
              },
            }),
          ],
        },
        {
          label: 'Styles',
          fields: [
            colorSwatchField({
              overrides: {
                name: 'titleFontColor',
                label: 'Title Font Color',
                admin: {
                  condition: (_, { type }) =>
                    ['sub-title-body', 'title-body', 'title'].includes(type),
                },
              },
            }),
            colorSwatchField({
              overrides: {
                name: 'subtitleFontColor',
                label: 'Subtitle Font Color',
                admin: {
                  condition: (_, { type }) => ['sub-title-body', 'subtitle'].includes(type),
                },
              },
            }),
            colorSwatchField({
              overrides: {
                name: 'bodyFontColor',
                label: 'Body Font Color',
                admin: {
                  condition: (_, { type }) =>
                    ['sub-title-body', 'title-body', 'body'].includes(type),
                },
              },
            }),
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Typography',
    singular: 'Typography',
  },
  interfaceName: 'TypographyBlock',
}
