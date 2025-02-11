import { getCachedDocuments } from '@/lib/utils/getDocument'
import type { MetadataRoute } from 'next'
import { PAGE_SLUG } from '@/payload/collections/constants'
import { Page } from '@payload-types'
import { cache } from '@/lib/utils/cache'
import getPayload from '@/lib/utils/getPayload'

export async function getBaseRoutes() {
  const payload = await getPayload()

  // Fetch all page slugs from the database
  const pages = await payload.find({
    collection: PAGE_SLUG,
    depth: 0,
    select: { slug: true, updatedAt: true },
  })

  // Static routes that should always be included
  const staticRoutes = [
    '/',
    '/blog',
    '/gallery',
    '/privacy',
    '/terms',
    '/shop-hot-tubs',
    '/shop-swim-spas',
    '/shop',
  ]

  // Combine page slugs with static routes, ensuring proper formatting
  const allRoutes = [
    ...staticRoutes.map((route) => ({
      route: route.startsWith('/') ? route.slice(1) : route,
      updatedAt: new Date(),
    })),
    ...pages.docs.map((page: any) => ({
      route: page.slug,
      updatedAt: new Date(page.updatedAt),
    })),
  ]

  // Remove duplicates while preserving the updatedAt information
  const uniqueRoutes = Array.from(new Map(allRoutes.map((item) => [item.route, item])).values())

  return uniqueRoutes
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getBaseRoutes()

  const returnRoutes = routes.map((route) => ({
    url: `${process.env.NEXT_PUBLIC_URL}${route.route === '' ? '' : `/${route.route}`}`,
    lastModified: route.updatedAt,
    changeFrequency: 'monthly' as
      | 'monthly'
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'yearly'
      | 'never',
    priority: route.route === '' ? 1 : 0.8, // Higher priority for homepage
  }))

  return [...returnRoutes]
}
