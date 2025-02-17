import getPayload from '@/lib/utils/getPayload'
import { SPA_SLUG } from '@/payload/collections/constants'
import { type MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_URL

export async function generateSitemaps() {
  const swimSpas = await getAllSwimSpas()
  const totalSwimSpas = swimSpas.length
  const numSitemaps = Math.ceil(totalSwimSpas / 50000)
  return Array.from({ length: numSitemaps }, (_, i) => ({ id: i + 1 }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const swimSpas = await getAllSwimSpas(id)
  return swimSpas.map((swimSpa) => ({
    url: `${BASE_URL}/shop-swim-spas/${swimSpa.slug}`,
    lastModified: swimSpa.updatedAt,
    changeFrequency: 'yearly',
    priority: 0.8,
  }))
}

async function getAllSwimSpas(page?: number) {
  const payload = await getPayload()
  const swimSpas = await payload.find({
    collection: SPA_SLUG,
    draft: false,
    overrideAccess: false,
    pagination: page ? true : false,
    ...(page && { page, limit: 50000 }),
    depth: 0,
    where: {
      type: {
        equals: 'swim-spa',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })
  return swimSpas.docs
}
