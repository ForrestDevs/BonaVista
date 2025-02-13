import React, { Suspense } from 'react'
import type { Gallery } from '@/payload-types'
import { GalleryCard } from '@/components/marketing/gallery/gallery-card'
import { OptimizedLink } from '@/components/payload/Link/optimized-link'
import { cn } from '@/lib/utils/cn'
import { buttonVariants } from '@/components/ui/button'
import { parseAsString, useQueryStates } from 'nuqs'
import { gallerySearchParamsCache } from './gallery-search-params'
import { SearchParams } from 'nuqs'
import { GALLERIES_SLUG } from '@/payload/collections/constants'
import getPayload from '@/lib/utils/getPayload'
import GalleryFilters from './gallery-filters'
import LoadingGallery from '@/components/layout/suspense/loading-gallery'
import { cache } from '@/lib/utils/cache'

async function getCachedGallery(slug: string) {
  const payload = await getPayload()

  const cacheFn = cache(
    async () => {
      const { docs } = await payload.find({
        collection: GALLERIES_SLUG,
        depth: 1,
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
      })
      return docs[0]
    },
    {
      tags: ['gallery', slug],
    },
    ['gallery', slug],
  )

  return cacheFn()
}

async function getCachedGallerySlugs() {
  const payload = await getPayload()

  const cacheFn = cache(
    async () => {
      const galleries = await payload.find({
        collection: GALLERIES_SLUG,
        depth: 0,
        select: {
          title: true,
          slug: true,
        },
      })
      return galleries.docs
    },
    {
      tags: ['gallery-slugs'],
    },
    ['gallery-slugs'],
  )

  return await cacheFn()
}

export async function GalleryList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const gallerySlugs = await getCachedGallerySlugs()
  const { collection } = await gallerySearchParamsCache.parse(searchParams)
  const gallery = await getCachedGallery(collection)

  return (
    <div>
      <GalleryFilters collections={gallerySlugs} />
      {gallery ? (
        <section className="container flex flex-col justify-center gap-10 py-10">
          <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
            {gallery?.images?.slice(0, 9).map((result, index) => {
              if (typeof result === 'object' && result !== null) {
                return (
                  <div className="col-span-4" key={index}>
                    <GalleryCard image={result} />
                  </div>
                )
              }
              return null
            })}
          </div>
          <OptimizedLink
            href={`/gallery/${gallery.slug}`}
            className={cn(
              buttonVariants({ variant: 'default' }),
              'rounded-none p-8 w-fit mx-auto text-xl',
            )}
          >
            View More
          </OptimizedLink>
        </section>
      ) : (
        <div className="container flex flex-col justify-center items-center gap-10 py-10">
          <p>No gallery found</p>
        </div>
      )}
    </div>
  )
}
