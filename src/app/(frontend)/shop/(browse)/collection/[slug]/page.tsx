import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCT_COLLECTION_SLUG } from '@payload/collections/constants'
import { getCachedDocument } from '@lib/utils/getDocument'
import { FilterConfig, SortOption } from '@/components/shop/filter/types'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import { SearchParams } from 'nuqs/server'
import { browseParamsCache } from '@/components/shop/filter/product-browse-params'
import ProductLayout from '@/components/shop/filter/product-layout'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const collection = await getCachedDocument<typeof PRODUCT_COLLECTION_SLUG>(
    PRODUCT_COLLECTION_SLUG,
    slug,
  )
  if (!collection) {
    notFound()
  }
  return {
    title: `${collection.title} | BonaVista Leisurescapes`,
    description: collection.description || '',
    openGraph: mergeOpenGraph({
      title: `${collection.title} | BonaVista Leisurescapes`,
      description: collection.description || '',
      url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/shop/collection/${slug}`,
    }),
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params
  await browseParamsCache.parse(searchParams)

  const collection = await getCachedDocument<typeof PRODUCT_COLLECTION_SLUG>(
    PRODUCT_COLLECTION_SLUG,
    slug,
    2,
  )

  if (!collection) {
    notFound()
  }

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
    defaultCollection: collection.id,
    options: {
      categories: [],
      collections: [],
      brands: [],
      compatibility: [],
    },
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{collection.title}</h1>
      <ProductLayout config={config} />
    </div>
  )
}
