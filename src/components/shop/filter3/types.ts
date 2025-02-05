import type { Product } from '@/payload-types'

export type SortOption = 'title' | 'price' | '-price' | '-createdAt'

export type FilterCriteria = {
  categories?: string[]
  collections?: string[]
  brands?: string[]
  compatibility?: ('swimspa' | 'hottub' | 'pool')[]
  price_min?: number
  price_max?: number
  sort?: SortOption
  search?: string
}

export interface FilterConfig {
  // Which filters to enable for this specific usage
  enabledFilters: {
    categories?: boolean
    collections?: boolean
    brands?: boolean
    compatibility?: boolean
    price?: boolean
    search?: boolean
  }
  // Initial values (useful for collection/category/brand pages)
  initialValues?: FilterCriteria
  sortOptions?: SortOption[]
  defaultSort?: SortOption
}

export type FilterState = {
  criteria: FilterCriteria
  isLoading: boolean
  error: Error | null
}

// Helper type for the filter options
export type FilterOption = {
  label: string
  value: string
  count?: number
}

// Type for available filter options
export type FilterOptions = {
  categories: FilterOption[]
  collections: FilterOption[]
  brands: FilterOption[]
  compatibility: FilterOption[]
}

// Type for active filters display
export type ActiveFilter = {
  type: keyof Omit<FilterCriteria, 'sort' | 'search'>
  value: string
  label: string
} 