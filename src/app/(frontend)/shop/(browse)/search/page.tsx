import React, { Suspense } from 'react'
import FilterList from '@components/shop/filter'
import { FilteredProducts } from '@components/shop/filtered-products'
import { ResultsSkeleton } from '@components/shop/skeletons/layout/product-results-skeleton'
import { sorting } from '@lib/search/constants'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: 'Search for products in the store.',
    title: 'Search',
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const { q: searchValue, sort, category } = params as { [key: string]: string }

  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <div className="container flex flex-col gap-8 my-16 pb-4 text-black md:flex-row dark:text-white">
        <FilteredProducts searchValue={searchValue} category={category} sort={sort} />

        <div className="order-none flex-none md:order-last md:w-[125px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
    </Suspense>
  )
}
