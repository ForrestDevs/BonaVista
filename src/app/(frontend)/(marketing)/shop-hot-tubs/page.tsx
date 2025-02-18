import React, { Suspense } from 'react'
import { queryPageBySlug } from '@/lib/utils/queryBySlug'
import { RenderHero } from '@/components/payload/heros'
import { RenderBlocks } from '@/components/payload/blocks'
import { SearchParams } from 'nuqs'
import HotTubList from '@/components/marketing/spas/hot-tub/hot-tub-list'
import LoadingPage from '@/components/layout/suspense/loading-page'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { generateMeta } from '@/lib/utils/generateMeta'
import { PAGE_SLUG, SPA_SLUG } from '@/payload/collections/constants'
import getPayload from '@/lib/utils/getPayload'

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug('shop-hot-tubs')

  if (!page) {
    return notFound()
  }

  return generateMeta({ doc: page, collectionSlug: PAGE_SLUG })
}

export async function generateStaticParams() {
  let paths: { slug: string }[] = []
  const payload = await getPayload()

  const hotTubs = await payload.find({
    collection: SPA_SLUG,
    draft: false,
    limit: 1000,
    overrideAccess: false,
    where: {
      type: {
        equals: 'hot-tub',
      },
    },
    select: {
      slug: true,
    },
  })

  if (hotTubs && Array.isArray(hotTubs) && hotTubs.length > 0) {
    paths = hotTubs.docs.map((hotTub) => {
      return { slug: hotTub.slug }
    })
  }

  return paths
}

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function ShopHotTubsHome({ searchParams }: PageProps) {
  const page = await queryPageBySlug('shop-hot-tubs')

  if (!page) {
    return notFound()
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex flex-col min-h-screen gap-20">
        <RenderHero {...page.hero} />
        <ShopHotTubsIntro />
        <HotTubList searchParams={searchParams} />
        <RenderBlocks blocks={page.layout} />
      </div>
    </Suspense>
  )
}

function ShopHotTubsIntro() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="text-primary text-sm sm:text-base md:text-lg font-light uppercase tracking-wider mb-2 sm:mb-3">
            Browse Our Collection
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Find Your Perfect Hot Tub
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Discover our extensive range of premium hot tubs, designed to bring relaxation and
            luxury to your home. Use our filters to find the perfect match for your space and
            lifestyle.
          </p>
        </div>
      </div>
    </section>
  )
}
