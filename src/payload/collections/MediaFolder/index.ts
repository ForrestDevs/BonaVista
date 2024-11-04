import { anyone } from '@/payload/access'
import { authenticated } from '@/payload/access'
import type { CollectionConfig } from 'payload'
import { MEDIA_FOLDER_SLUG, MEDIA_SLUG } from '../constants'

const MediaFolder: CollectionConfig = {
  slug: MEDIA_FOLDER_SLUG,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'media',
      type: 'join',
      on: 'folder',
      collection: MEDIA_SLUG,
    },
  ],
  admin: {
    useAsTitle: 'name',
    // hidden: true,
  },
} as const

export default MediaFolder
