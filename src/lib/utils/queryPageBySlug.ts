import { draftMode } from 'next/headers'
import getPayload from './getPayload'
import { cache } from '@/lib/utils/cache'

export const queryPageBySlug = cache(
  async (slug: string) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload()

    const { docs } = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      overrideAccess: draft,
      where: { slug: { equals: slug } },
    })
    return docs?.[0] || null
  },
  {
    tags: (pathname) => [pathname],
    revalidate: 3600,
  },
)
