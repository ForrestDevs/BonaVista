import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Spa } from '@payload-types'

export const revalidateSpa: CollectionAfterChangeHook<Spa> = ({ doc, req: { payload } }) => {
  const type = doc.type === 'hot-tub' ? 'shop-hot-tubs' : 'shop-swim-spas'
  const path = `/${type}/${doc.slug}`

  payload.logger.info(`Revalidating spa at path: ${path}`)

  revalidatePath(path)
  revalidateTag(`spa-${doc.slug}`)

  return doc
}
