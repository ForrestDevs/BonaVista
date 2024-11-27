import React from 'react'
import { BasePayload, ServerProps } from 'payload'
import { MediaListClient } from './client'
import { MEDIA_FOLDER_SLUG, MEDIA_SLUG } from '@/payload/collections/constants'
import { cache } from 'react'
import { MediaFolder } from '@payload-types'

const getFolders = cache(async (payload: BasePayload) => {
  return await payload.find({
    collection: MEDIA_FOLDER_SLUG,
    depth: 1,
    limit: 100,
  })
})

export type FolderOption = {
  numItems: number
  value: string
  label: string
  id: string
}

const getFolderOptions = cache(async (payload: BasePayload, folders: MediaFolder[]) => {
  return Promise.all(
    folders.map(async (folder): Promise<FolderOption> => {
      const media = await payload.find({
        collection: MEDIA_SLUG,
        where: {
          folder: {
            in: [folder.id],
          },
        },
        depth: 0,
      })
      return {
        numItems: media.totalDocs,
        value: folder.id,
        label: folder.name,
        id: folder.id,
      }
    }),
  )
})

export default async function MediaList(props: ServerProps) {
  const { payload } = props
  const folders = await getFolders(payload)
  const folderOptions = await getFolderOptions(payload, folders.docs)

  return <MediaListClient folderOptions={folderOptions} params={props.params} />
}
