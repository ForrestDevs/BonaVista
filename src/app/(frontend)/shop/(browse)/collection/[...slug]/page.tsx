import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SHOP_COLLECTION_SLUG } from '@payload/collections/constants'
import { getCachedDocument } from '@lib/utils/getDocument'
import { sorting } from '@lib/search/constants'
import FilterList from '@components/shop/filter'
import { FilteredProducts } from '@components/shop/filtered-products'
import { ResultsSkeleton } from '@components/shop/skeletons/layout/product-results-skeleton'

type Props = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = await params
  const collection = await getCachedDocument<typeof SHOP_COLLECTION_SLUG>(
    SHOP_COLLECTION_SLUG,
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
  const { sort, category } = (await searchParams) as { [key: string]: string }
  const { slug } = await params

  return (
    <React.Fragment>
      <div className="container flex flex-col gap-8 my-16 pb-4 text-black md:flex-row dark:text-white">
        <Suspense fallback={<ResultsSkeleton />}>
          <FilteredProducts slug={slug} category={category} sort={sort} />
        </Suspense>

        <div className="order-none flex-none md:order-last md:w-[125px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
    </React.Fragment>
  )
}
