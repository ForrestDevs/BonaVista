import getPayload from '@lib/utils/getPayload'
import {
  BRAND_SLUG,
  PRODUCT_CATEGORY_SLUG,
  PRODUCT_COLLECTION_SLUG,
  PRODUCT_SLUG,
} from '@payload/collections/constants'
import { Metadata } from 'next'
import { FilterConfig, FilterOption, SortOption } from '@/components/shop/filter/types'
import { browseParamsCache } from '@/components/shop/filter/product-browse-params'
import type { SearchParams } from 'nuqs/server'
import ProductLayout from '@/components/shop/filter/product-layout'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Products | BonaVista Leisurescapes',
    description: 'Browse our complete collection of pool and spa care products',
    openGraph: mergeOpenGraph({
      title: 'All Products | BonaVista Leisurescapes',
      description: 'Browse our complete collection of pool and spa care products',
      url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/shop/products`,
    }),
  }
}

type PageProps = {
  searchParams: Promise<SearchParams>
}

// Separate content component to be wrapped with the search params context
export default async function ProductsPage({ searchParams }: PageProps) {
  // Get payload instance to make optimized queries
  const payload = await getPayload()
  await browseParamsCache.parse(searchParams)

  // Fetch all leaf categories with product counts
  const leafCategories = await payload.find({
    collection: PRODUCT_CATEGORY_SLUG,
    depth: 0,
    limit: 100,
    where: {
      isLeaf: {
        equals: true,
      },
    },
  })
  // Get product counts for each category
  const categoryOptions: FilterOption[] = leafCategories.docs.map((category) => {
    return {
      label: category.title,
      value: category.slug,
      count: category.products.docs.length,
    }
  })
  // Only include categories with products
  const filteredCategoryOptions = categoryOptions.filter((cat) => cat.count > 0)
  // Get collections with product counts
  const collectionsResponse = await payload.find({
    collection: PRODUCT_COLLECTION_SLUG,
    depth: 0,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })
  const collectionOptions: FilterOption[] = collectionsResponse.docs.map((collection) => {
    return {
      label: collection.title,
      value: collection.slug,
      count: collection.products.docs.length,
    }
  })
  // Only include collections with products
  const filteredCollectionOptions = collectionOptions.filter((col) => col.count > 0)
  // Get brands with product counts
  const brandsResponse = await payload.find({
    collection: BRAND_SLUG,
    depth: 0,
  })
  const brandOptions: FilterOption[] = brandsResponse.docs.map((brand) => {
    return {
      label: brand.name,
      value: brand.slug,
      count: brand.products.docs.length,
    }
  })
  // Only include brands with products
  const filteredBrandOptions = brandOptions.filter((brand) => brand.count > 0)
  // Get compatibility options with counts
  const compatibilityValues = ['hottub', 'swimspa', 'pool']
  const compatibilityOptions = await Promise.all(
    compatibilityValues.map(async (value) => {
      const count = await payload.count({
        collection: PRODUCT_SLUG,
        where: {
          compatibility: {
            equals: value,
          },
        },
      })
      return {
        label: value === 'hottub' ? 'Hot Tub' : value === 'swimspa' ? 'Swim Spa' : 'Pool',
        value,
        count: count.totalDocs,
      }
    }),
  )
  // Only include compatibility options with products
  const filteredCompatibilityOptions = compatibilityOptions.filter((opt) => opt.count > 0)

  // Configure which filters to enable
  const config: FilterConfig = {
    enabledFilters: {
      categories: filteredCategoryOptions.length > 0,
      collections: filteredCollectionOptions.length > 0,
      brands: filteredBrandOptions.length > 0,
      compatibility: filteredCompatibilityOptions.length > 0,
      price: true,
      search: true,
    },
    sortOptions: ['title', 'priceMin', '-priceMax', '-createdAt'] as SortOption[],
    defaultSort: 'title' as SortOption,
    defaultPageSize: 12,
    options: {
      categories: filteredCategoryOptions,
      collections: filteredCollectionOptions,
      brands: filteredBrandOptions,
      compatibility: filteredCompatibilityOptions,
    },
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">All Products</h1>
      <ProductLayout config={config} />
    </div>
  )
}
