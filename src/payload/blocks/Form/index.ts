import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { FORM_BLOCK_SLUG } from '../constants'

export const Form: Block = {
  slug: FORM_BLOCK_SLUG,
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'preTitle',
      type: 'text',
      label: 'Pre Title',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Body Text',
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
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
    },
  ],
}
