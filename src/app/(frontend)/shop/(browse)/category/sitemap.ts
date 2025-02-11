import getPayload from '@/lib/utils/getPayload'
import { PRODUCT_CATEGORY_SLUG, SPA_SLUG } from '@/payload/collections/constants'
import { type MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_URL

export async function generateSitemaps() {
  const categories = await getAllCategories()
  const totalCategories = categories.length
  const numSitemaps = Math.ceil(totalCategories / 50000)
  return Array.from({ length: numSitemaps }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const categories = await getAllCategories(id)
  return categories.map((category) => ({
    url: `${BASE_URL}/shop/category/${category.fullSlug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
}

async function getAllCategories(page?: number) {
  const payload = await getPayload()
  const categories = await payload.find({
    collection: PRODUCT_CATEGORY_SLUG,
    draft: false,
    overrideAccess: false,
    pagination: page ? true : false,
    ...(page && { page, limit: 50000 }),
    depth: 0,
    select: {
      fullSlug: true,
      slug: true,
      updatedAt: true,
    },
  })
  return categories.docs
}
