import React, { Suspense } from 'react'
import { RenderHero } from '@/components/payload/heros'
import { queryPageBySlug } from '@/lib/utils/queryBySlug'
import { generateMeta } from '@/lib/utils/generateMeta'
import { PAGE_SLUG } from '@/payload/collections/constants'
import { Metadata } from 'next'
import { GalleryList } from '@/components/marketing/gallery/gallery-list'
import { SearchParams } from 'nuqs'
import LoadingGallery from '@/components/layout/suspense/loading-gallery'
import { notFound } from 'next/navigation'
import { gallerySearchParamsCache } from '@/components/marketing/gallery/gallery-search-params'

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug('gallery')

  return generateMeta({ doc: page, collectionSlug: PAGE_SLUG })
}

export default async function GalleryHome({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const page = await queryPageBySlug('gallery')
  await gallerySearchParamsCache.parse(searchParams)

  if (!page) {
    return notFound()
  }

  return (
    <Suspense fallback={<LoadingGallery />}>
      <div className="flex flex-col min-h-screen space-y-10">
        <RenderHero {...page.hero} />
        <GalleryIntro />
        <GalleryList />
      </div>
    </Suspense>
  )
}

function GalleryIntro() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="text-primary text-sm sm:text-base md:text-lg font-light uppercase tracking-wider mb-2 sm:mb-3">
            Our Project Gallery
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            See Our Work in Action
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Browse through our collection of completed projects and installations. From luxurious
            hot tub setups to complete backyard transformations, get inspired by seeing how
            we&apos;ve helped create dream outdoor spaces for our clients.
          </p>
        </div>
      </div>
    </section>
  )
}
