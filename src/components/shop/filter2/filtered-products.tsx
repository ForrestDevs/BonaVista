import { Suspense } from 'react'
import { useProductFilters } from '@/hooks/useProductFilters'
import type { Product } from '@/payload-types'
import ProductGridItems from './product-grid-items'
import Grid from '@components/payload/grid'

interface FilteredProductsProps {
  // For collection/category/brand pages
  slug?: string
  // For search pages
  searchValue?: string
  // Configuration for this instance
  filterConfig: FilterConfig
  // Optional initial products (if already fetched)
  initialProducts?: Product[]
}

export async function FilteredProducts({
  slug,
  searchValue,
  filterConfig,
  initialProducts,
}: FilteredProductsProps) {
  const { products, filteredProducts, resultsText } = await useFilteredProducts({
    slug,
    searchValue,
    filterConfig,
    initialProducts,
  })

  return (
    <div className="order-last min-h-screen w-full md:order-none">
      <div className="space-y-4">
        {/* Results summary */}
        <ResultsSummary
          count={filteredProducts.length}
          searchValue={searchValue}
          activeFilters={activeFilters}
        />

        {/* Products grid */}
        <Suspense fallback={<ProductGridSkeleton />}>
          {filteredProducts?.length > 0 ? (
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <ProductGridItems products={filteredProducts} />
            </Grid>
          ) : null}
        </Suspense>
      </div>
    </div>
  )
}
