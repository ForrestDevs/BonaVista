'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Product } from '@/payload-types'
import type { FilterCriteria, FilterConfig } from './types'

// Helper function to get product price (base or first variant)
const getProductPrice = (product: Product): number => {
  if (product.enableVariants && product.variants?.variantProducts?.length) {
    return product.variants.variantProducts[0].price
  }
  return product.baseProduct?.price || 0
}

// Helper function to check if a product is within a price range
const isInPriceRange = (product: Product, min?: number, max?: number): boolean => {
  if (!min && !max) return true

  // Get all prices (base and variants)
  const prices: number[] = []
  if (product.baseProduct?.price) {
    prices.push(product.baseProduct.price)
  }
  if (product.enableVariants && product.variants?.variantProducts) {
    prices.push(...product.variants.variantProducts.map(v => v.price))
  }

  // Check if any price is within range
  return prices.some(price => {
    if (min && price < min) return false
    if (max && price > max) return false
    return true
  })
}

export function useFilteredProducts(
  initialProducts: Product[],
  criteria: FilterCriteria,
  config: FilterConfig
) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Function to fetch products based on criteria
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Here you would make an API call to fetch products based on criteria
      // For now, we'll just use the initial products
      setProducts(initialProducts)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [initialProducts])

  // Fetch products when criteria changes (except price and sort which are handled client-side)
  useEffect(() => {
    const shouldFetch = criteria.categories?.length ||
      criteria.collections?.length ||
      criteria.brands?.length ||
      criteria.compatibility?.length ||
      criteria.search

    if (shouldFetch) {
      fetchProducts()
    } else {
      setProducts(initialProducts)
    }
  }, [
    criteria.categories,
    criteria.collections,
    criteria.brands,
    criteria.compatibility,
    criteria.search,
    fetchProducts,
    initialProducts
  ])

  // Apply client-side filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Apply price filter (client-side)
    if (criteria.price_min || criteria.price_max) {
      result = result.filter(product =>
        isInPriceRange(product, criteria.price_min, criteria.price_max)
      )
    }

    // Apply sorting (client-side)
    if (criteria.sort) {
      result.sort((a, b) => {
        switch (criteria.sort) {
          case 'price':
            return getProductPrice(a) - getProductPrice(b)
          case '-price':
            return getProductPrice(b) - getProductPrice(a)
          case '-createdAt':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'title':
          default:
            return a.title.localeCompare(b.title)
        }
      })
    }

    return result
  }, [products, criteria.price_min, criteria.price_max, criteria.sort])

  return {
    products: filteredAndSortedProducts,
    isLoading,
    error,
  }
} 