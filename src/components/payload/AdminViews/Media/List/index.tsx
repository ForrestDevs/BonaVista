import React from 'react'
import { ServerProps } from 'payload'
import { MediaListClient } from './client'
import { MEDIA_FOLDER_SLUG } from '@/payload/collections/constants'

export default async function MediaList(props: ServerProps) {
  const { payload } = props

  const folders = await payload.find({
    collection: MEDIA_FOLDER_SLUG,
  })
  return <MediaListClient folders={folders} />
}
