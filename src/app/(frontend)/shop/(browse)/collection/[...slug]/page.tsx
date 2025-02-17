import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCT_COLLECTION_SLUG, PRODUCT_SLUG } from '@payload/collections/constants'
import { getCachedDocument, getCachedDocuments } from '@lib/utils/getDocument'
import { FilteredProducts } from '@components/shop/filter3/FilteredProducts'
import { SortOption } from '@/components/shop/filter3/types'
import Link from 'next/link'
type Props = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCachedDocument<typeof PRODUCT_COLLECTION_SLUG>(
    PRODUCT_COLLECTION_SLUG,
    slug[0],
  )
  if (!collection) {
    notFound()
  }
  return {
    title: `${collection.title} | BonaVista Leisurescapes`,
    description: collection.description || '',
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { sort, collectionSlug } = (await searchParams) as { [key: string]: string }
  const { slug } = await params

  const collection = await getCachedDocument<typeof PRODUCT_COLLECTION_SLUG>(
    PRODUCT_COLLECTION_SLUG,
    collectionSlug,
    2,
  )

  if (!collection) {
    notFound()
  }

  const products = await getCachedDocuments<typeof PRODUCT_SLUG>({
    collection: PRODUCT_SLUG,
    depth: 1,
    limit: 1000,
    where: {
      collections: {
        in: collection.id,
      },
    },
  })

  const filterOptions = {
    categories: [],
    collections: [{ label: collection.title, value: collection.slug }],
    brands: [],
    compatibility: [
      { label: 'Hot Tub', value: 'hottub' },
      { label: 'Swim Spa', value: 'swimspa' },
      { label: 'Pool', value: 'pool' },
    ],
  }

  // Configure which filters to enable
  const config = {
    enabledFilters: {
      categories: true,
      collections: true,
      brands: true,
      compatibility: true,
      price: true,
      search: true,
    },
    sortOptions: ['title', 'price', '-price', '-createdAt'] as SortOption[],
    defaultSort: '-createdAt' as SortOption,
  }

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      {products.length > 0 ? (
        <FilteredProducts
          key={collection.id}
          initialProducts={products}
          config={config}
          options={filterOptions}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full py-16">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            We couldn&apos;t find any products in this category. Please try browsing other
            categories or check back later.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Shop
          </Link>
        </div>
      )}
    </div>
  )
}
