import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCT_CATEGORY_SLUG } from '@payload/collections/constants'
import { getCachedDocument } from '@lib/utils/getDocument'
import { sorting } from '@lib/search/constants'
import FilterList from '@components/shop/filter'
import { FilteredProducts } from '@components/shop/filtered-products'
import { ResultsSkeleton } from '@components/shop/skeletons/layout/product-results-skeleton'
import Link from 'next/link'
import getPayload from '@/lib/utils/getPayload'
import { ProductCard } from '@/components/shop/products/product-card'

type Props = {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lastSlug = slug[slug.length - 1]
  const category = await getCachedDocument<typeof PRODUCT_CATEGORY_SLUG>(
    PRODUCT_CATEGORY_SLUG,
    lastSlug,
  )
  if (!category) {
    notFound()
  }
  return {
    title: `${category.title} | BonaVista Leisurescapes`,
    description: category.description || '',
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const lastSlug = slug[slug.length - 1]

  const category = await getCachedDocument<typeof PRODUCT_CATEGORY_SLUG>(
    PRODUCT_CATEGORY_SLUG,
    lastSlug,
    2,
  )
  
  if (!category) {
    notFound()
  }

  return (
    <React.Fragment>
      <div className="container my-16 pb-4 text-black dark:text-white">
        {!category.isLeaf ? (
          // Show subcategories if this is a parent category
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {category.children?.docs?.map((child: any) => (
              <Link
                key={child.id}
                href={`/shop/category/${slug.join('/')}/${child.slug}`}
                className="p-6 border rounded-lg hover:border-gray-400 transition-colors"
              >
                <h2 className="text-xl font-semibold">{child.title}</h2>
                {child.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{child.description}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          // Show products if this is a leaf category
          <div className="flex flex-col gap-8 md:flex-row">
            {/* {category.products.docs.map((product: any) => (
              <div key={product.id}>{product.title}</div>
            ))} */}
            <Suspense fallback={<ResultsSkeleton />}>
              {category.products.docs.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {/* <FilteredProducts slug={lastSlug} category={category.id} sort={sort} /> */}
            </Suspense>

            <div className="order-none flex-none md:order-last md:w-[125px]">
              <FilterList list={sorting} title="Sort by" />
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
