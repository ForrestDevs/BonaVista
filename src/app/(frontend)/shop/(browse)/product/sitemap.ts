import getPayload from '@/lib/utils/getPayload'
import { PRODUCT_CATEGORY_SLUG, PRODUCT_SLUG, SPA_SLUG } from '@/payload/collections/constants'
import { type MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_URL

export async function generateSitemaps() {
  const products = await getAllProducts()
  const totalProducts = products.length
  const numSitemaps = Math.ceil(totalProducts / 50000)
  return Array.from({ length: numSitemaps }, (_, i) => ({ id: i + 1 }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts(id)
  return products.map((product) => ({
    url: `${BASE_URL}/shop/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
}

async function getAllProducts(page?: number) {
  const payload = await getPayload()
  const products = await payload.find({
    collection: PRODUCT_SLUG,
    draft: false,
    overrideAccess: false,
    pagination: page ? true : false,
    ...(page && { page, limit: 50000 }),
    depth: 0,
    where: {
      or: [
        {
          'baseProduct.productActive': {
            equals: true,
          },
        },
        {
          'variants.variantProducts.productActive': {
            equals: true,
          },
        },
      ],
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })
  return products.docs
}
