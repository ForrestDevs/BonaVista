'use server'

import { cache } from '@/lib/utils/cache'
import getPayload from '@/lib/utils/getPayload'
import { MEDIA_SLUG } from '@/payload/collections/constants'

export async function getCachedLineItemThumbnail(mediaId: number) {
  const cacheFn = cache(
    async () => {
      const payload = await getPayload()
      const media = await payload.findByID({
        collection: MEDIA_SLUG,
        id: mediaId,
      })
      return media
    },
    {
      tags: [`line-item-thumbnail:${mediaId}`],
    },
  )

  return cacheFn()
}
