import { useQueryState } from 'nuqs'
import { useCallback, useMemo } from 'react'
import type { FilterCriteria, SortOption } from './types'

export function useFilterState(defaultSort?: SortOption) {
  // Categories
  const [categories, setCategories] = useQueryState('categories', {
    parse: (value) => value?.split(',').filter(Boolean) ?? [],
    serialize: (value) => (value.length ? value.join(',') : null),
  })

  // Collections
  const [collections, setCollections] = useQueryState('collections', {
    parse: (value) => value?.split(',').filter(Boolean) ?? [],
    serialize: (value) => (value.length ? value.join(',') : null),
  })

  // Brands
  const [brands, setBrands] = useQueryState('brands', {
    parse: (value) => value?.split(',').filter(Boolean) ?? [],
    serialize: (value) => (value.length ? value.join(',') : null),
  })

  // Compatibility
  const [compatibility, setCompatibility] = useQueryState('compatibility', {
    parse: (value) => value?.split(',').filter(Boolean) as ('swimspa' | 'hottub' | 'pool')[] ?? [],
    serialize: (value) => (value.length ? value.join(',') : null),
  })

  // Price Range
  const [priceMin, setPriceMin] = useQueryState('price_min', {
    parse: (value) => (value ? Number(value) : undefined),
    serialize: (value) => (value ? value.toString() : null),
  })

  const [priceMax, setPriceMax] = useQueryState('price_max', {
    parse: (value) => (value ? Number(value) : undefined),
    serialize: (value) => (value ? value.toString() : null),
  })

  // Sort
  const [sort, setSort] = useQueryState<SortOption>('sort', {
    parse: (value) => value as SortOption ?? defaultSort,
    serialize: (value) => value ?? null,
  })

  // Search
  const [search, setSearch] = useQueryState('q', {
    parse: (value) => value ?? '',
    serialize: (value) => value || null,
  })

  // Combined criteria object
  const criteria = useMemo<FilterCriteria>(
    () => ({
      categories,
      collections,
      brands,
      compatibility,
      price_min: priceMin,
      price_max: priceMax,
      sort,
      search,
    }),
    [categories, collections, brands, compatibility, priceMin, priceMax, sort, search]
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    setCategories([])
    setCollections([])
    setBrands([])
    setCompatibility([])
    setPriceMin(undefined)
    setPriceMax(undefined)
    setSort(defaultSort)
    setSearch('')
  }, [setCategories, setCollections, setBrands, setCompatibility, setPriceMin, setPriceMax, setSort, setSearch, defaultSort])

  return {
    criteria,
    setters: {
      setCategories,
      setCollections,
      setBrands,
      setCompatibility,
      setPriceMin,
      setPriceMax,
      setSort,
      setSearch,
    },
    clearFilters,
  }
} 