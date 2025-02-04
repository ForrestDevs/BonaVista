import type { CollectionAfterChangeHook } from 'payload'

// import { revalidatePath } from 'next/cache'

// Revalidate the page in the background, so the user doesn't have to wait
// Notice that the hook itself is not async and we are not awaiting `revalidate`
// Only revalidate existing docs that are published
// Don't scope to `operation` in order to purge static demo pages
export const revalidateProduct: CollectionAfterChangeHook = ({ doc, previousDoc, req: { payload } }) => {
  // if (doc._status === 'published') {
  //   const path = `/shop/product/${doc.slug}`

  //   payload.logger.info(`Revalidating product at path: ${path}`)
  //   revalidatePath(path)

  //   // Also revalidate the shop page
  //   payload.logger.info('Revalidating shop page')
  //   revalidatePath('/shop')
  // }

  // // If the product was previously published, we need to revalidate the old path
  // if (previousDoc?._status === 'published' && doc._status !== 'published') {
  //   const oldPath = `/shop/product/${previousDoc.slug}`

  //   payload.logger.info(`Revalidating old product at path: ${oldPath}`)
  //   revalidatePath(oldPath)
    
  //   // Also revalidate the shop page
  //   payload.logger.info('Revalidating shop page')
  //   revalidatePath('/shop')
  // }

  return doc
}