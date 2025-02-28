import type { Product } from '@/payload-types'

export type SortOption = 'title' | 'priceMin' | '-priceMax' | '-createdAt'

// Modern sort descriptor format: field_direction
export type SortDescriptor = 
  | 'createdAt_desc' 
  | 'createdAt_asc' 
  | 'price_asc' 
  | 'price_desc' 
  | 'title_asc' 
  | 'title_desc'

// Basic filter option structure
export interface FilterOption {
  label: string
  value: string
  count?: number
}

// Filter criteria passed to the API
export interface FilterCriteria {
  // Filters
  categories?: string[]
  collections?: string[]
  brands?: string[]
  compatibility?: ('swimspa' | 'hottub' | 'pool')[]

  // Price range
  price_min?: number
  price_max?: number

  // Search
  search?: string

  // Sort
  sort?: SortOption

  // Pagination
  page?: number
  limit?: number
}

// Configuration for filter component
export interface FilterConfig {
  // Which filters to enable
  enabledFilters: {
    categories?: boolean
    collections?: boolean
    brands?: boolean
    compatibility?: boolean
    price?: boolean
    search?: boolean
  }

  // Available sort options
  sortOptions?: SortOption[]

  // Default sort order
  defaultSort?: SortOption

  // Default category for category page
  defaultCategory?: number

  // Default collection for collection page
  defaultCollection?: number

  // Default brand for brand page
  defaultBrand?: number

  // Default page size
  defaultPageSize?: number

  options: {
    categories?: FilterOption[]
    collections?: FilterOption[]
    brands?: FilterOption[]
    compatibility?: FilterOption[]
  }
}

// State returned by useFilteredProducts
export interface FilterState {
  products: any[]
  isLoading: boolean
  error: Error | null
  totalCount: number
  currentPage: number
  totalPages: number
}

// Extended option type for hierarchical categories
export interface HierarchicalFilterOption extends FilterOption {
  children?: HierarchicalFilterOption[]
  parentId?: number | null
  isLeaf?: boolean
  level?: number
}

// Type for available filter options
export type FilterOptions = {
  categories: HierarchicalFilterOption[]
  collections: FilterOption[]
  brands: FilterOption[]
  compatibility: FilterOption[]
}

// Type for active filters display
export type ActiveFilter = {
  type: keyof Omit<FilterCriteria, 'sort' | 'search' | 'page' | 'limit'>
  value: string
  label: string
}
