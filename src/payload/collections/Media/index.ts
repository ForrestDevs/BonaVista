import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { anyone, authenticated } from '@payload/access'
import { MEDIA_FOLDER_SLUG, MEDIA_SLUG } from '../constants'
import { formatFilenameHook } from './hooks/formatFilename'
import { formatAltHook } from './hooks/formatAlt'

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
        beforeValidate: [formatAltHook],
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
  hooks: {
    beforeValidate: [formatFilenameHook],
  },
  upload: {
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        fit: 'cover',
        width: 500,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 100,
          },
        },
      },
    ],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80,
      },
    },
    resizeOptions: {
      width: 2560,
      withoutEnlargement: true,
    },
    bulkUpload: true,
    disableLocalStorage: true,
    focalPoint: true,
    crop: true,
    pasteURL: {
      allowList: [
        {
          hostname: 'payloadcms.com', // required
          pathname: '',
          port: '',
          protocol: 'https',
          search: '',
        },
        {
          hostname: 'drive.google.com',
          protocol: 'https',
        },
        {
          hostname: 'www.bonavistaleisurescapes.com',
          protocol: 'https',
        },
        {
          hostname: 'www.acdcfeeds.com',
          protocol: 'https',
        },
      ],
    },
  },
} as const

export default Media
