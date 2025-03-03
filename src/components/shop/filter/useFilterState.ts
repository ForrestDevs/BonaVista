'use client'

import { useQueryState } from 'nuqs'
import { TransitionStartFunction, useCallback, useMemo } from 'react'
import type { FilterCriteria } from './types'
import { filterParsers } from './product-browse-params'

export function useFilterState(startTransition: TransitionStartFunction) {
  // Sort state
  const [sort, setSort] = useQueryState(
    's',
    filterParsers.sort.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  // Filter states
  const [categories, setCategories] = useQueryState(
    'cat',
    filterParsers.categories.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  const [collections, setCollections] = useQueryState(
    'col',
    filterParsers.collections.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  const [brands, setBrands] = useQueryState(
    'b',
    filterParsers.brands.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  const [compatibility, setCompatibility] = useQueryState(
    'comp',
    filterParsers.compatibility.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  // Price range
  const [price_min, setPriceMin] = useQueryState(
    'pmn',
    filterParsers.price_min.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  const [price_max, setPriceMax] = useQueryState(
    'pmx',
    filterParsers.price_max.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  // Search query
  const [search, setSearch] = useQueryState(
    'q',
    filterParsers.q.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  // Pagination state
  const [page, setPage] = useQueryState(
    'p',
    filterParsers.page.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  const [pageSize, setPageSize] = useQueryState(
    'l',
    filterParsers.limit.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
    }),
  )

  // Current combined criteria
  const criteria = useMemo<FilterCriteria>(
    () => ({
      sort,
      categories,
      collections,
      brands,
      compatibility,
      price_min,
      price_max,
      search,
      page,
      limit: pageSize,
    }),
    [
      sort,
      categories,
      collections,
      brands,
      compatibility,
      price_min,
      price_max,
      search,
      page,
      pageSize,
    ],
  )

  // Function to clear all filters
  const clearFilters = useCallback(() => {
    setCategories([])
    setCollections([])
    setBrands([])
    setCompatibility([])
    setPriceMin(null)
    setPriceMax(null)
    setSearch('')
    setPage(1)
    // Keep the page size intact as it's more of a user preference
  }, [
    setCategories,
    setCollections,
    setBrands,
    setCompatibility,
    setPriceMin,
    setPriceMax,
    setSearch,
    setPage,
  ])

  return {
    criteria,
    setters: {
      setSort,
      setCategories,
      setCollections,
      setBrands,
      setCompatibility,
      setPriceMin,
      setPriceMax,
      setSearch,
      setPage,
      setPageSize,
    },
    clearFilters,
  }
}
