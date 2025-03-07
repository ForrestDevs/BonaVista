import type { CollectionConfig } from 'payload'
import { admin, anyone } from '@payload/access'
import { hero } from '@payload/fields/hero'
import { pageBlocks } from '@/payload/blocks'
import { slugField } from '@/payload/fields/slug'
import { populatePublishedAt } from '@payload/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/lib/utils/generatePreviewPath'
import { revalidatePage } from './hooks/revalidatePage'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { PAGE_SLUG } from '../constants'

const Pages: CollectionConfig = {
  slug: PAGE_SLUG,
  access: {
    create: admin,
    delete: admin,
    read: anyone,
    update: admin,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    },
    preview: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    group: 'Website',
    useAsTitle: 'title',
  },
  fields: [
    ...slugField(),
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: pageBlocks,
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({
              overrides: {
                maxLength: 200,
              },
            }),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,
              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      validate: true,
      autosave: {
        interval: 10000, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
} as const

export default Pages
