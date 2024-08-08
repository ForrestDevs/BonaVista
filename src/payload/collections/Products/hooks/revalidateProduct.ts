import type { CollectionAfterChangeHook } from 'payload'
import { Product } from '@/payload-types'
import { revalidate } from '@/payload/utilities/revalidate'

// Revalidate the page in the background, so the user doesn't have to wait
// Notice that the hook itself is not async and we are not awaiting `revalidate`
// Only revalidate existing docs that are published
// Don't scope to `operation` in order to purge static demo pages
export const revalidateProduct: CollectionAfterChangeHook<Product> = ({ doc, req: { payload } }) => {
  if (doc._status === 'published') {
    revalidate({ slug: doc.slug, collection: 'products', payload })
  }

  return doc
}