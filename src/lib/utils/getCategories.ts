import { cache } from './cache'
import getPayload from './getPayload'
import { PRODUCT_CATEGORY_SLUG } from '@/payload/collections/constants'

export function getCachedCategoriesByParentId(parentId: number | null = null) {
  const cachedFn = cache(
    async () => {
      const payload = await getPayload()

      const { docs } = await payload.find({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          parent: {
            equals: parentId,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          fullSlug: true,
          parent: true,
          isLeaf: true,
        },
        depth: 0,
      })

      return docs
    },
    {
      tags: (parentId) => [`categories-by-parent-${parentId}`],
    },
    [`categories-by-parent-${parentId}`],
  )

  return cachedFn()
}

export function getCachedRootCategories() {
  const cachedFn = cache(
    async () => {
      return getCachedCategoriesByParentId(null)
    },
    {
      tags: ['root-categories'],
    },
  )

  return cachedFn()
}

export function getCachedCollections() {
  const cachedFn = cache(
    async () => {
      const payload = await getPayload()

      const { docs } = await payload.find({
        collection: 'product-collections',
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          title: true,
          slug: true,
        },
        depth: 0,
      })

      return docs
    },
    {
      tags: ['collections'],
    },
  )

  return cachedFn()
}
