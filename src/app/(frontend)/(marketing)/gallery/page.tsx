import React, { Suspense } from 'react'
import { RenderHero } from '@/components/payload/heros'
import { queryPageBySlug } from '@/lib/utils/queryBySlug'
import { generateMeta } from '@/lib/utils/generateMeta'
import { GALLERIES_SLUG, PAGE_SLUG } from '@/payload/collections/constants'
import { Metadata } from 'next'
import LoadingPage from '@/components/layout/suspense/loading-page'
import { getCachedDocuments } from '@/lib/utils/getDocument'
import { GalleryList } from '@/components/marketing/gallery/gallery-list'
import { SearchParams } from 'nuqs'
import LoadingGallery from '@/components/layout/suspense/loading-gallery'

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

  return (
    <Suspense fallback={<LoadingGallery />}>
      <div className="flex flex-col min-h-screen space-y-10">
        <RenderHero {...page.hero} />
        <GalleryIntro />
        <GalleryList searchParams={searchParams} />
      </div>
    </Suspense>
  )
}

function GalleryIntro() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-lg font-light uppercase tracking-wider mb-3">
            Our Project Gallery
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See Our Work in Action
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Browse through our collection of completed projects and installations. From luxurious
            hot tub setups to complete backyard transformations, get inspired by seeing how
            we&apos;ve helped create dream outdoor spaces for our clients.
          </p>
        </div>
      </div>
    </section>
  )
}
