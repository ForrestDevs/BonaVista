import React, { Suspense } from 'react'
import { ResultsSkeleton } from '@components/shop/skeletons/layout/product-results-skeleton'
import { Metadata } from 'next'
import ProductLayout from '@/components/shop/filter/product-layout'
import { SortOption } from '@/components/shop/filter/types'
import { FilterConfig } from '@/components/shop/filter/types'
import { browseParamsCache } from '@/components/shop/filter/product-browse-params'
import { SearchParams } from 'nuqs/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: 'Search for products in the store.',
    title: 'Search',
  }
}

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: searchValue } = await browseParamsCache.parse(searchParams)

  const config: FilterConfig = {
    enabledFilters: {
      categories: false,
      collections: false,
      brands: false,
      compatibility: false,
      price: true,
      search: true,
    },
    sortOptions: ['title', 'priceMin', '-priceMax', '-createdAt'] as SortOption[],
    defaultSort: 'title' as SortOption,
    defaultPageSize: 12,
    options: {
      categories: [],
      collections: [],
      brands: [],
      compatibility: [],
    },
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Search Results for {searchValue}</h1>
      <ProductLayout config={config} />
    </div>
  )
}
