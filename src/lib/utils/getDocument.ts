import { unstable_cache } from 'next/cache'
import { CollectionSlug, DataFromCollectionSlug } from 'payload'
import getPayload from './getPayload'

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
  const cache = unstable_cache(
    async () => getDocument<T>(collection, slug, depth),
    [collection, slug],
    {
      tags: [`${collection}_${slug}`],
    },
  )

  return await cache()
}
