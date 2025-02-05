import { unstable_cache } from 'next/cache'
import { CollectionSlug, DataFromCollectionSlug, Where } from 'payload'
import getPayload from './getPayload'
import { cache } from '@/lib/utils/cache'
export async function getDocument<T extends CollectionSlug>(
  collection: T,
  slug: string,
  depth = 0,
): Promise<DataFromCollectionSlug<T> | null> {
  const payload = await getPayload()

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (page.docs.length > 0) {
    return page.docs[0]
  }

  return null
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export async function getCachedDocument<T extends CollectionSlug>(
  collection: T,
  slug: string,
  depth?: number,
) {
  const cacheFn = cache(
    async () => getDocument<T>(collection, slug, depth),
    {
      tags: [`${collection}_${slug}`],
    },
    [collection, slug],
  )

  return await cacheFn()
}

export async function getDocuments<T extends CollectionSlug>({
  collection,
  where,
  depth,
  limit,
}: {
  collection: T
  where?: Where
  depth?: number
  limit?: number
}) {
  const payload = await getPayload()
  const documents = await payload.find({ collection, where: where || undefined, depth, limit })
  return documents.docs
}

export async function getCachedDocuments<T extends CollectionSlug>({
  collection,
  where,
  depth,
  limit,
}: {
  collection: T
  where?: Where
  depth?: number
  limit?: number
}) {
  const cacheFn = cache(
    async () => getDocuments<T>({ collection, where, depth, limit }),
    {
      tags: [`${collection}_${JSON.stringify(where)}`, `get${collection}`],
    },
    [collection, JSON.stringify(where)],
  )

  return await cacheFn()
}
