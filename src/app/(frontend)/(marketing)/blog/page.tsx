import React, { Suspense } from 'react'
import type { Metadata } from 'next/types'
import BlogFilters from '@/components/marketing/blog/filter'
import FilteredPagination from '@/components/marketing/blog/pagination'
import { blogFiltersCache } from '@/components/marketing/blog/searchParams'
import { RenderHero } from '@/components/payload/heros'
import { queryPageBySlug } from '@/lib/utils/queryBySlug'
import { generateMeta } from '@/lib/utils/generateMeta'
import { BLOG_CATEGORY_SLUG, PAGE_SLUG } from '@/payload/collections/constants'
import { getCachedDocuments } from '@/lib/utils/getDocument'
import LoadingPage from '@/components/layout/suspense/loading-page'
import { notFound } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug('blog')

  return generateMeta({ doc: page, collectionSlug: PAGE_SLUG })
}

type Args = {
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
}

export default async function Page({ searchParams }: Args) {
  const searchParams_ = await searchParams
  const { category, page } = blogFiltersCache.parse(searchParams_)
  const blogLayout = await queryPageBySlug('blog')

  if (!blogLayout) {
    return notFound()
  }

  const categories = await getCachedDocuments({
    collection: BLOG_CATEGORY_SLUG,
    depth: 0,
    where: { showInFilter: { equals: true } },
  })

  const categoryId = categories?.find((result) => result.slug === category)?.id

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex flex-col min-h-screen gap-20">
        <RenderHero {...blogLayout.hero} />
        <BlogIntro />
        <BlogFilters categories={categories} />
        <FilteredPagination category={categoryId} page={page} />
      </div>
    </Suspense>
  )
}

function BlogIntro() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="text-primary text-sm sm:text-base md:text-lg font-light uppercase tracking-wider mb-2 sm:mb-3">
            Dive into Our World
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Explore the Latest in Luxury Living
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Welcome to our blog, where we share expert insights, maintenance tips, and inspiring
            stories about the joys of swim spa & hot tub ownership. Whether you&apos;re a seasoned
            enthusiast or just starting your journey, there&apos;s something here for everyone.
          </p>
        </div>
      </div>
    </section>
  )
}
