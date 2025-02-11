import { draftMode } from 'next/headers'
import getPayload from './getPayload'
import { cache } from '@/lib/utils/cache'
import { PAGE_SLUG, POST_SLUG, SPA_SLUG } from '@/payload/collections/constants'

export const queryPostBySlug = cache(
  async ({ slug }: { slug: string }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload()

    const result = await payload.find({
      collection: POST_SLUG,
      draft,
      limit: 1,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
  {
    tags: (slug) => [`post-${slug}`],
    revalidate: 3600,
  },
)

export const queryPageBySlug = cache(
  async (slug: string) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload()

    const { docs } = await payload.find({
      collection: PAGE_SLUG,
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: { slug: { equals: slug } },
    })
    return docs?.[0] || null
  },
  {
    tags: (slug) => [`page-${slug}`],
    revalidate: 3600,
  },
)

export const querySpaBySlug = cache(
  async (slug: string) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload()

    const { docs } = await payload.find({
      collection: SPA_SLUG,
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: { slug: { equals: slug } },
    })
    console.log('spas', docs)
    return docs?.[0] || null
  },
  {
    tags: (slug) => [`spa-${slug}`],
    revalidate: 3600,
  },
)
