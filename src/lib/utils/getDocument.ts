import { unstable_cache } from 'next/cache'
import { CollectionSlug, DataFromCollectionSlug, Where } from 'payload'
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

export async function getDocuments<T extends CollectionSlug>({
  collection,
  where,
  depth,
}: {
  collection: T
  where?: Where
  depth?: number
}) {
  const payload = await getPayload()
  const documents = await payload.find({ collection, where: where || undefined, depth })
  return documents.docs

  // try {
  //   console.log(where)

  //   console.log(documents)
  //   return documents.docs
  // } catch (error) {
  //   console.error(error)
  //   return []
  // }
}

export async function getCachedDocuments<T extends CollectionSlug>({
  collection,
  where,
  depth,
}: {
  collection: T
  where?: Where
  depth?: number
}) {
  // console.log(`tag: ${collection}_${JSON.stringify(where)}`)

  const cache = unstable_cache(
    async () => getDocuments<T>({ collection, where, depth }),
    [collection, JSON.stringify(where)],
    {
      tags: [`${collection}_${JSON.stringify(where)}`],
    },
  )

  return await cache()
}
