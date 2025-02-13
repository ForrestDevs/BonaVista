import React, { Suspense } from 'react'
import { queryPageBySlug } from '@/lib/utils/queryBySlug'
import { RenderHero } from '@/components/payload/heros'
import { RenderBlocks } from '@/components/payload/blocks'
import { SearchParams } from 'nuqs'
import HotTubList from '@/components/marketing/spas/hot-tub/hot-tub-list'
import LoadingPage from '@/components/layout/suspense/loading-page'
export default async function ShopHotTubsHome({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const page = await queryPageBySlug('shop-hot-tubs')

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex flex-col min-h-screen gap-20">
        <RenderHero {...page.hero} />
        <section className="container flex flex-col items-center text-center gap-4">
          <p className="text-md font-medium text-primary tracking-wide">Browse Our Collection</p>
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
            Find Your Perfect Hot Tub
          </h1>
          <p className="mx-auto max-w-5xl text-lg text-muted-foreground">
            Discover our extensive range of premium hot tubs, designed to bring relaxation and
            luxury to your home. Use our filters to find the perfect match for your space and
            lifestyle.
          </p>
        </section>

        <HotTubList searchParams={searchParams} />
        <RenderBlocks blocks={page.layout} />
      </div>
    </Suspense>
  )
}
