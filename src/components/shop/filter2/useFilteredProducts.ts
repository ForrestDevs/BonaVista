import { useFilterState } from './useFilterState'
import { useMemo } from 'react'
import type { Product } from '@/payload-types'
import type { FilterState } from './filter'

// Client-side hook
export function useFilteredProducts(products: Product[]) {
  const { filters } = useFilterState()

  return useMemo(() => filterAndSortProducts(products, filters), [products, filters])
}

// Pure function for filtering and sorting
export function filterAndSortProducts(products: Product[], filters: FilterState) {
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (filters.categories.length > 0) {
      const productCategories =
        product.categories?.map((cat) => (typeof cat === 'string' ? cat : cat.slug)) || []
      if (!filters.categories.some((cat) => productCategories.includes(cat))) {
        return false
      }
    }

    // Brand filter
    if (filters.brands.length > 0) {
      const productBrands =
        product.brand?.map((brand) => (typeof brand === 'string' ? brand : brand.slug)) || []
      if (!filters.brands.some((brand) => productBrands.includes(brand))) {
        return false
      }
    }

    // Compatibility filter
    if (filters.compatibility.length > 0) {
      if (!product.compatibility?.some((comp) => filters.compatibility.includes(comp))) {
        return false
      }
    }

    // Price filter
    if (filters.priceRange.min > 0 || filters.priceRange.max < Infinity) {
      const prices = product.enableVariants
        ? product.variants?.variantProducts.map((v) => v.price)
        : [product.baseProduct?.price]

      const minPrice = Math.min(...((prices?.filter(Boolean) as number[]) || [0]))
      const maxPrice = Math.max(...((prices?.filter(Boolean) as number[]) || [0]))

      if (minPrice > filters.priceRange.max || maxPrice < filters.priceRange.min) {
        return false
      }
    }

    return true
  })

  // Apply sorting
  return [...filteredProducts].sort((a, b) => {
    switch (filters.sort) {
      case 'price':
        return getProductPrice(a) - getProductPrice(b)
      case '-price':
        return getProductPrice(b) - getProductPrice(a)
      case '-createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return a.title.localeCompare(b.title)
    }
  })
}

// Helper function to get base product price (used for sorting)
const getProductPrice = (product: Product): number => {
  if (product.enableVariants && product.variants?.variantProducts.length) {
    return product.variants.variantProducts[0].price || 0
  }
  return product.baseProduct?.price || 0
}
