import type { Block, Field } from 'payload'
import {
  HeadingFeature,
  InlineToolbarFeature,
  BlocksFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { Archive } from '../ArchiveBlock'
import { Banner } from '../Banner'
import { CallToAction } from '../CallToAction'
import { Code } from '../Code'
import { Media } from '../Media'
import { Typography } from '../Typography'
import { Card } from '../Card'
import { blocks } from '../inline-blocks'

const columnFields: Field[] = [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Column Options',
        fields: [],
      },
      {
        label: 'Content',
        fields: [
          {
            name: 'contentType',
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
            admin: {
              condition: (_, { contentType }) => contentType === 'richText',
            },
          },
          {
            name: 'blocks',
            type: 'blocks',
            blocks: [Archive, Banner, CallToAction, Code, Media, Typography, Card],
            admin: {
              condition: (_, { contentType }) => contentType === 'blocks',
            },
          },
        ],
      },
    ],
  },
]

export const Grid: Block = {
  slug: 'grid',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Grid Options',
          fields: [
            {
              name: 'gridStyle',
              type: 'select',
              required: true,
              defaultValue: 'basic',
              options: [
                {
                  label: 'Basic Grid',
                  value: 'basic',
                },
                {
                  label: 'Masonry',
                  value: 'masonry',
                },
                {
                  label: 'Responsive',
                  value: 'responsive',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'columns',
                  type: 'number',
                  defaultValue: 3,
                  admin: {
                    description: 'Number of columns in the grid',
                  },
                },
                {
                  name: 'gap',
                  type: 'number',
                  defaultValue: 20,
                  admin: {
                    description: 'Gap between grid items in pixels',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'array',
              fields: columnFields,
            },
          ],
        },
      ],
    },
  ],
}
