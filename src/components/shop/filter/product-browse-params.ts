import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  createSerializer,
} from 'nuqs/server'
import type { SortOption } from './types'

// Define with proper types
export const SORT_OPTIONS = ['title', 'priceMin', '-priceMax', '-createdAt'] as const
export const COMPATIBILITY_OPTIONS = ['swimspa', 'hottub', 'pool'] as const
export const LIMIT_OPTIONS = [12, 24, 48, 96] as const

export type PageSizeOption = (typeof LIMIT_OPTIONS)[number]

// Define all parsers for filter parameters
export const filterParsers = {
  // Sort options
  sort: parseAsStringLiteral(SORT_OPTIONS)
    .withDefault('title' as SortOption)
    .withOptions({ clearOnDefault: true }),

  // Filter parameters
  categories: parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  collections: parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  brands: parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  compatibility: parseAsArrayOf(parseAsStringLiteral(COMPATIBILITY_OPTIONS))
    .withDefault([])
    .withOptions({ clearOnDefault: true }),

  // Price range
  price_min: parseAsInteger.withDefault(null).withOptions({ clearOnDefault: true }),
  price_max: parseAsInteger.withDefault(null).withOptions({ clearOnDefault: true }),

  // Search query
  q: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),

  // Pagination
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  limit: parseAsInteger.withDefault(LIMIT_OPTIONS[0]).withOptions({ clearOnDefault: true }),
}

// Create a server-side cache for these parameters
export const browseParamsCache = createSearchParamsCache(filterParsers, {
  urlKeys: {
    sort: 's',
    categories: 'cat',
    collections: 'col',
    brands: 'b',
    compatibility: 'comp',
    price_min: 'pmn',
    price_max: 'pmx',
    q: 'q',
    page: 'p',
    limit: 'l',
  },
})
export const serialize = createSerializer(filterParsers)
