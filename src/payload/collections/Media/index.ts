import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone, authenticated } from '@payload/access'
import { MEDIA_SLUG } from '../constants'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const Media: CollectionConfig = {
  slug: MEDIA_SLUG,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'tour_gallery_1',
        width: undefined,
        height: 320,
        position: 'centre',
      },
      {
        name: 'tour_card',
        width: 320,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'tour_gallery',
        width: undefined,
        height: 797,
        position: 'centre',
      },
      {
        name: 'blog_image_size2',
        width: 986,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'blog_image_size3',
        width: 1470,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'appointment_contact_image',
        width: 547,
        height: undefined,
        position: 'centre',
      },
      {
        height: undefined,
        width: 525,
        crop: 'center',
        name: 'doctorImage',
      },
      {
        height: undefined,
        width: 1296,
        crop: 'center',
        name: 'blogImage',
      },
    ],
    focalPoint: false,
    crop: false,
  },
} as const

export default Media
