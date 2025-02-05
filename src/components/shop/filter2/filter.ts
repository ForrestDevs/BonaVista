export type SortOption = 'title' | 'price' | '-price' | '-createdAt'

export type FilterableFields = {
  categories: string[]
  collections: string[]
  brands: string[]
  compatibility: ('swimspa' | 'hottub' | 'pool')[]
  price_min: number
  price_max: number
  sort: 'title' | 'price' | '-price' | '-createdAt'
  search: string
}

export interface FilterConfig {
  // Which filters to enable for this specific usage
  enabledFilters: {
    categories?: boolean
    collections?: boolean
    brands?: boolean
    compatibility?: boolean
    price?: boolean
  }
  // Initial values (useful for collection/category/brand pages)
  initialValues?: {
    categories?: string[]
    collections?: string[]
    brands?: string[]
    compatibility?: ('swimspa' | 'hottub' | 'pool')[]
    search?: string
  }
  sortOptions?: SortOption[]
  defaultSort?: SortOption
}
