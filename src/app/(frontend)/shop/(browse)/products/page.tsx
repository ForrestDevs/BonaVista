import getPayload from '@lib/utils/getPayload'
import {
  BRAND_SLUG,
  PRODUCT_CATEGORY_SLUG,
  PRODUCT_COLLECTION_SLUG,
  PRODUCT_SLUG,
} from '@payload/collections/constants'
import { ProductCard } from '@/components/shop/products/product-card'
import { Metadata } from 'next'
import { FilteredProducts } from '@/components/shop/filter3/FilteredProducts'
import { SortOption } from '@/components/shop/filter3/types'
import { getCachedDocuments } from '@/lib/utils/getDocument'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Products | BonaVista Leisurescapes',
    description: 'Browse our complete collection of pool and spa care products',
    openGraph: {
      title: 'All Products | BonaVista Leisurescapes',
      description: 'Browse our complete collection of pool and spa care products',
    },
  }
}

export default async function ProductsPage() {
  const [products, categoryDocs, collectionDocs, brandDocs] = await Promise.all([
    getCachedDocuments({
      collection: PRODUCT_SLUG,
      depth: 1,
      limit: 1000,
    }),
    getCachedDocuments({
      collection: PRODUCT_CATEGORY_SLUG,
      depth: 1,
      limit: 100,
    }),
    getCachedDocuments({
      collection: PRODUCT_COLLECTION_SLUG,
      depth: 1,
      limit: 100,
    }),
    getCachedDocuments({
      collection: BRAND_SLUG,
      depth: 1,
      limit: 100,
    }),
  ])

  const categories = categoryDocs.map((cat) => ({
    label: cat.title,
    value: cat.slug,
  }))

  const collections = collectionDocs.map((collection) => ({
    label: collection.title,
    value: collection.slug,
  }))

  const brands = brandDocs.map((brand) => ({
    label: brand.name,
    value: brand.slug,
  }))

  const filterOptions = {
    categories: categories,
    collections: collections,
    brands: brands,
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
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <FilteredProducts initialProducts={products} config={config} options={filterOptions} />
    </div>
  )
}
