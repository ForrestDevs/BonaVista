import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCT_CATEGORY_SLUG, PRODUCT_SLUG } from '@payload/collections/constants'
import { getCachedDocument, getCachedDocuments } from '@lib/utils/getDocument'
import { sorting } from '@lib/search/constants'
import FilterList from '@components/shop/filter'
import { FilteredProducts } from '@components/shop/filter3/FilteredProducts'
import { ResultsSkeleton } from '@components/shop/skeletons/layout/product-results-skeleton'
import Link from 'next/link'
import getPayload from '@/lib/utils/getPayload'
import { ProductCard } from '@/components/shop/products/product-card'
import { SortOption } from '@/components/shop/filter3/types'
import { Product } from '@payload-types'
import ProductBreadcrumb from '../../product/[slug]/components/product-breadcrumb'

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

  const products = await getCachedDocuments<typeof PRODUCT_SLUG>({
    collection: PRODUCT_SLUG,
    depth: 1,
    limit: 1000,
    where: {
      categories: {
        in: category.id,
      },
    },
  })

  const filterOptions = {
    categories: [{ label: category.title, value: category.id }],
    collections: [],
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
    <React.Fragment>
      <div className="container my-16 pb-4 text-black dark:text-white">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href="/shop" className="hover:text-foreground transition-colors">
                Shop
              </Link>
            </li>
            {slug.map((segment, index) => {
              const path = `/shop/category/${slug.slice(0, index + 1).join('/')}`
              const isLast = index === slug.length - 1

              return (
                <li key={segment} className="flex items-center">
                  <span className="mx-2">/</span>
                  {isLast ? (
                    <span className="font-medium text-foreground">{category.title}</span>
                  ) : (
                    <Link href={path} className="hover:text-foreground transition-colors">
                      {segment}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>

        {!category.isLeaf ? (
          // Show subcategories if this is a parent category
          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {category.children?.docs?.map((child: any) => (
                <Link
                  key={child.id}
                  href={`/shop/category/${slug.join('/')}/${child.slug}`}
                  className="group relative overflow-hidden rounded-lg border hover:border-gray-400 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    {/* Placeholder for when we have images */}
                    <div className="flex h-full items-center justify-center text-4xl text-gray-400 dark:text-gray-600">
                      {/* Show first letter of category name as icon */}
                      {child.title.charAt(0)}
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-900 transition-colors group-hover:bg-gray-50 dark:group-hover:bg-gray-800">
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {child.title}
                    </h2>
                    {child.description && (
                      <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                        {child.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-sm text-primary">
                      <span>Browse Category</span>
                      <svg
                        className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Newsletter Section */}
            <div className="bg-primary/5 rounded-2xl p-8 md:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Our Latest Products</h2>
                <p className="text-muted-foreground mb-6">Subscribe to our newsletter and get exclusive offers, new product alerts, and expert tips delivered to your inbox.</p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Why Shop With Us Banner */}
            <div className="grid md:grid-cols-3 gap-8 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Free Shipping</h3>
                <p className="text-muted-foreground text-sm">On orders over $100</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Secure Shopping</h3>
                <p className="text-muted-foreground text-sm">100% Protected Payments</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground text-sm">Dedicated Customer Service</p>
              </div>
            </div>
          </div>
        ) : (
          // Show products if this is a leaf category
          <div className="flex flex-col gap-8 md:flex-row">
            {category.products.docs.length > 0 ? (
              <FilteredProducts
                key={category.id}
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

            <div className="order-none flex-none md:order-last md:w-[125px]">
              <FilterList list={sorting} title="Sort by" />
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
