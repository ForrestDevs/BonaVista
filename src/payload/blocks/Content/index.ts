import type { Block, Field } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '../../fields/link'
import { blocks } from '../inline-blocks'
import { Archive } from '../ArchiveBlock'
import { Banner } from '../Banner'
import { CallToAction } from '../CallToAction'
import { Code } from '../Code'
import { Media } from '../Media'
import { Typography } from '../Typography'
import { Card } from '../Card'
import { Grid } from '../Grid'

const columnFields: Field[] = [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Options',
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'type',
                type: 'select',
                defaultValue: 'blocks',
                options: [
                  {
                    label: 'Blocks',
                    value: 'blocks',
                  },
                  {
                    label: 'Rich Text',
                    value: 'richText',
                  },
                ],
              },
              {
                label: 'Width',
                name: 'size',
                type: 'select',
                defaultValue: 'oneThird',
                options: [
                  {
                    label: 'One Third',
                    value: 'oneThird',
                  },
                  {
                    label: 'Half',
                    value: 'half',
                  },
                  {
                    label: 'Two Thirds',
                    value: 'twoThirds',
                  },
                  {
                    label: 'Full',
                    value: 'full',
                  },
                ],
                admin: {
                  description: 'Sets the width of the column',
                },
              },
            ],
          },
          {
            type: 'row',
            fields: [
              {
                name: 'height',
                type: 'number',
                label: 'Height',
                admin: {
                  description: 'Sets the height of the column in pixels, leave blank for auto',
                },
              },
              {
                label: 'Alignment',
                admin: {
                  description: 'Aligns horizontal items along the y-axis',
                },
                name: 'align',
                type: 'select',
                defaultValue: 'start',
                options: [
                  {
                    label: 'Start',
                    value: 'start',
                  },
                  {
                    label: 'Center',
                    value: 'center',
                  },
                  {
                    label: 'End',
                    value: 'end',
                  },
                ],
              },
            ],
          },
          {
            type: 'row',
            fields: [
              {
                name: 'enableLink',
                type: 'checkbox',
                admin: {
                  condition: (_, { type }) => type === 'richText',
                },
                label: 'Enable Link',
              },
              {
                name: 'enableBackgroundImage',
                type: 'checkbox',
                label: 'Enable Background Image',
              },
            ],
          },
          {
            name: 'backgroundImage',
            type: 'upload',
            relationTo: 'media',
            admin: {
              condition: (_, { enableBackgroundImage }) => Boolean(enableBackgroundImage),
            },
          },
        ],
      },
      {
        label: 'Content',
        fields: [
          {
            name: 'richText',
            type: 'richText',
            editor: lexicalEditor({
              features: ({ rootFeatures }) => {
                return [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  InlineToolbarFeature(),
                  BlocksFeature({ inlineBlocks: blocks, blocks: blocks }),
                ]
              },
            }),
            label: false,
            admin: {
              condition: (_, { type }) => type === 'richText',
            },
          },
          {
            name: 'blocks',
            type: 'blocks',
            blocks: [Archive, Banner, CallToAction, Code, Media, Typography, Card, Grid],
            admin: {
              condition: (_, { type }) => type === 'blocks',
            },
          },
          link({
            overrides: {
              admin: {
                condition: (_, { enableLink }) => Boolean(enableLink),
              },
            },
          }),
        ],
      },
    ],
  },
]

export const Content: Block = {
  slug: 'content',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Options',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'gapX',
                  type: 'number',
                  label: 'Gap X',

                  admin: {
                    description: 'Sets the gap between columns horizontally',
                  },
                },
                {
                  name: 'gapY',
                  type: 'number',
                  label: 'Gap Y',
                  admin: {
                    description: 'Sets the gap between columns vertically',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Columns',
          fields: [
            {
              name: 'columns',
              type: 'array',
              fields: columnFields,
            },
          ],
        },
      ],
    },
  ],
  interfaceName: 'ContentBlock',
}
