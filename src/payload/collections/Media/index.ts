import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone, authenticated } from '@payload/access'
import { GALLERIES_SLUG, MEDIA_FOLDER_SLUG, MEDIA_SLUG } from '../constants'

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
      name: 'folder',
      type: 'relationship',
      hasMany: true,
      relationTo: MEDIA_FOLDER_SLUG,
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [
          ({ data }) => {
            return data?.filename
          },
        ],
      },
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
    ],
    bulkUpload: true,
    disableLocalStorage: true,
    focalPoint: true,
    crop: true,
    // formatOptions: {
    //   format: 'webp',
    //   options: {},
    // },
    // resizeOptions: {},
  },
  admin: {
    components: {
      views: {
        list: {
          Component: 'src/components/payload/AdminViews/Media/List',
        },
      },
    },
  },
} as const

export default Media
