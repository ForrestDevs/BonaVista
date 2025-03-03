import React, { Suspense } from 'react'
import getPayload from '@lib/utils/getPayload'
import { browseParamsCache } from './product-browse-params'
import {
  BRAND_SLUG,
  PRODUCT_CATEGORY_SLUG,
  PRODUCT_COLLECTION_SLUG,
  PRODUCT_SLUG,
} from '@/payload/collections/constants'
import ProductGridItems from '../products/product-grid-items'
import Grid from '@components/payload/grid'
import ProductPagination from './product-pagination'
import ProductSort from './product-sort'
import { FilterConfig } from './types'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FilterDrawerButton } from './filter-drawer-button'

export default async function ProductList({ config }: { config: FilterConfig }) {
  const {
    page,
    limit,
    categories,
    collections,
    brands,
    compatibility,
    sort,
    q,
    price_max,
    price_min,
  } = browseParamsCache.all()

  const payload = await getPayload()

  // Fetch category IDs if categories are selected
  const categoryIds = await Promise.all(
    categories.map(async (category) => {
      try {
        const categoryDoc = await payload.find({
          collection: PRODUCT_CATEGORY_SLUG,
          where: {
            slug: {
              equals: category,
            },
          },
        })

        return categoryDoc.docs[0]?.id
      } catch (error) {
        console.error(`Error fetching category ${category}:`, error)
        return null
      }
    }),
  ).then((ids) => ids.filter(Boolean))

  // Fetch collection IDs if collections are selected
  const collectionIds = await Promise.all(
    collections.map(async (collection) => {
      try {
        const collectionDoc = await payload.find({
          collection: PRODUCT_COLLECTION_SLUG,
          where: {
            slug: {
              equals: collection,
            },
          },
        })

        return collectionDoc.docs[0]?.id
      } catch (error) {
        console.error(`Error fetching collection ${collection}:`, error)
        return null
      }
    }),
  ).then((ids) => ids.filter(Boolean))

  // Fetch brand IDs if brands are selected
  const brandIds = await Promise.all(
    brands.map(async (brand) => {
      try {
        const brandDoc = await payload.find({
          collection: BRAND_SLUG,
          where: {
            slug: {
              equals: brand,
            },
          },
        })

        return brandDoc.docs[0]?.id
      } catch (error) {
        console.error(`Error fetching brand ${brand}:`, error)
        return null
      }
    }),
  ).then((ids) => ids.filter(Boolean))

  // Build the query
  const where = {
    and: [
      q && {
        or: [
          {
            title: {
              like: q,
            },
          },
          {
            description: {
              like: q,
            },
          },
        ],
      },
      (categoryIds.length > 0 || config.defaultCategory) && {
        categories: {
          in: config.defaultCategory ? [config.defaultCategory] : categoryIds,
        },
      },
      (collectionIds.length > 0 || config.defaultCollection) && {
        collections: {
          in: config.defaultCollection ? [config.defaultCollection] : collectionIds,
        },
      },
      (brandIds.length > 0 || config.defaultBrand) && {
        brand: {
          in: config.defaultBrand ? [config.defaultBrand] : brandIds,
        },
      },
      compatibility.length > 0 && {
        compatibility: {
          in: compatibility,
        },
      },
      price_min !== (0 || null) && {
        priceMin: {
          greater_than_equal: price_min,
        },
      },
      price_max !== (0 || null) && {
        priceMax: {
          less_than_equal: price_max,
        },
      },
    ].filter(Boolean),
  }

  // Fetch products with filters
  const products = await payload.find({
    collection: PRODUCT_SLUG,
    where,
    sort,
    limit: limit || 12,
    page: page || 1,
    depth: 1,
  })

  // Calculate total active filters for badge display
  const activeFilterCount = 
    (categories?.length || 0) + 
    (collections?.length || 0) + 
    (brands?.length || 0) + 
    (compatibility?.length || 0) + 
    ((price_min || price_max) ? 1 : 0);

  return (
    <div className="w-full min-h-[500px]">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        {/* Results count - always first in the wrap order */}
        <p className="text-sm md:text-base tracking-tight text-muted-foreground font-medium order-first">
          <span>{products.totalDocs}</span> results
        </p>
        
        {/* Controls container - for mobile layout */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto order-last">
          {/* Filter button for small/medium screens */}
          <div className="xl:hidden order-first">
            <FilterDrawerButton config={config} activeFilterCount={activeFilterCount} />
          </div>
          
          {/* Sort dropdown */}
          <div>
            <ProductSort config={config}/>
          </div>
        </div>
      </div>

      {products.docs.length > 0 ? (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            <ProductGridItems products={products.docs} />
          </Grid>

          {products.totalPages > 1 && (
            <ProductPagination
              currentPage={products.page}
              totalPages={products.totalPages}
              totalProducts={products.totalDocs}
            />
          )}
        </>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center">
          <Alert variant="default" className="max-w-md border-blue-100 bg-blue-50">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">No products found</AlertTitle>
            <AlertDescription className="text-blue-700">
              We couldn&apos;t find any products that match your current filter criteria. Try
              broadening your search or changing the filters.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
