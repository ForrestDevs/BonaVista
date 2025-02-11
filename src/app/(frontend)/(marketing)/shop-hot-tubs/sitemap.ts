import getPayload from '@/lib/utils/getPayload'
import { SPA_SLUG } from '@/payload/collections/constants'
import { type MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_URL

export async function generateSitemaps() {
  const hotTubs = await getAllHotTubs()
  const totalHotTubs = hotTubs.length
  const numSitemaps = Math.ceil(totalHotTubs / 50000)
  return Array.from({ length: numSitemaps }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const hotTubs = await getAllHotTubs(id)
  return hotTubs.map((hotTub) => ({
    url: `${BASE_URL}/shop-hot-tubs/${hotTub.slug}`,
    lastModified: hotTub.updatedAt,
    changeFrequency: 'yearly',
    priority: 0.8,
  }))
}

async function getAllHotTubs(page?: number) {
  const payload = await getPayload()
  const hotTubs = await payload.find({
    collection: SPA_SLUG,
    draft: false,
    overrideAccess: false,
    pagination: page ? true : false,
    ...(page && { page, limit: 50000 }),
    depth: 0,
    where: {
      type: {
        equals: 'hot-tub',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })
  return hotTubs.docs
}
