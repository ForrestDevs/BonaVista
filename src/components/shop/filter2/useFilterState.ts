import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import type { SortOption } from './filter'

export function useFilterState() {
  const [categories, setCategories] = useQueryState('categories', {
    parse: (value) => value?.split(',').filter(Boolean) ?? [],
    serialize: (value) => (value.length ? value.join(',') : null),
  })

  const [brands, setBrands] = useQueryState('brands', {
    parse: (value) => value?.split(',').filter(Boolean) ?? [],
    serialize: (value) => (value.length ? value.join(',') : null),
  })

  const [priceRange, setPriceRange] = useQueryState('price', {
    parse: (value) => {
      const [min, max] = value?.split('-').map(Number) ?? []
      return { min: min || 0, max: max || Infinity }
    },
    serialize: (value) => (value.min || value.max ? `${value.min || 0}-${value.max || ''}` : null),
  })

  const [sort, setSort] = useQueryState<SortOption>('sort', {
    parse: (value) => value as SortOption,
    serialize: (value) => value,
  })

  const clearFilters = useCallback(() => {
    setCategories([])
    setBrands([])
    setPriceRange({ min: 0, max: Infinity })
  }, [setCategories, setBrands, setPriceRange])

  return {
    filters: {
      categories,
      brands,
      priceRange,
      sort,
    },
    setters: {
      setCategories,
      setBrands,
      setPriceRange,
      setSort,
    },
    clearFilters,
  }
}
