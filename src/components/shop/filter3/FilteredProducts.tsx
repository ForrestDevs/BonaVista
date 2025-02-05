'use client'

import { useEffect, useMemo } from 'react'
import type { Product } from '@/payload-types'
import { useFilterState } from './useFilterState'
import { useFilteredProducts } from './useFilteredProducts'
import { FilterOptions } from './FilterOptions'
import type { FilterConfig, FilterOption } from './types'
import ProductGridItems from '../product-grid-items'
import Grid from '@components/payload/grid'

interface FilteredProductsProps {
  // Initial products (if already fetched)
  initialProducts: Product[]
  // Filter configuration
  config: FilterConfig
  // Available filter options
  options: {
    categories?: FilterOption[]
    collections?: FilterOption[]
    brands?: FilterOption[]
    compatibility?: FilterOption[]
  }
  // Optional class name for the grid
  className?: string
}

export function FilteredProducts({
  initialProducts,
  config,
  options,
  className,
}: FilteredProductsProps) {
  // Set up filter state
  const { criteria, setters, clearFilters } = useFilterState(config.defaultSort)

  // Get filtered and sorted products
  const { products, isLoading, error } = useFilteredProducts(initialProducts, criteria, config)

  // Update document title when search is active
  useEffect(() => {
    if (criteria.search) {
      document.title = `Search: ${criteria.search} | Your Store Name`
    }
  }, [criteria.search])

  // Compute results text
  const resultsText = useMemo(() => {
    const count = products.length
    const base = count === 1 ? '1 result' : `${count} results`

    if (criteria.search) {
      return `${base} for "${criteria.search}"`
    }

    return base
  }, [products.length, criteria.search])

  // Handle filter updates
  const handleUpdateFilter = (key: keyof typeof criteria, value: any) => {
    const setter = setters[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`]
    if (setter) {
      setter(value)
    }
  }

  return (
    <div className="container flex flex-col gap-8 pb-4 text-black md:flex-row dark:text-white">
      {/* Main content area with products */}
      <div className="order-last min-h-screen w-full md:order-none">
        {/* Results info */}
        <div className="pb-4">
          <p className="text-sm text-gray-500">{resultsText}</p>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* No results */}
        {!isLoading && !error && products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">No products found matching your criteria.</p>
          </div>
        )}

        {/* Product grid */}
        {!isLoading && !error && products.length > 0 && (
          <Grid className={className || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}>
            <ProductGridItems products={products} />
          </Grid>
        )}
      </div>

      {/* Filters sidebar */}
      <div className="order-first w-full flex-none md:max-w-[250px]">
        <FilterOptions
          config={config}
          criteria={criteria}
          options={options}
          onUpdateFilter={handleUpdateFilter}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  )
}
