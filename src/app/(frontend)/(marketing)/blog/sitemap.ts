import getPayload from '@/lib/utils/getPayload'
import { POST_SLUG } from '@/payload/collections/constants'
import { type MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_URL

export async function generateSitemaps() {
  const posts = await getAllPosts()
  const totalPosts = posts.length
  const numSitemaps = Math.ceil(totalPosts / 50000)
  return Array.from({ length: numSitemaps }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts(id)
  return posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
}

async function getAllPosts(page?: number) {
  const payload = await getPayload()
  const posts = await payload.find({
    collection: POST_SLUG,
    draft: false,
    overrideAccess: false,
    pagination: page ? true : false,
    ...(page && { page, limit: 50000 }),
    depth: 0,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })
  return posts.docs
}
