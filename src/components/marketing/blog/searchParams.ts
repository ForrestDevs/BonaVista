import { parseAsString, parseAsInteger, createSearchParamsCache } from 'nuqs/server'

export const blogFiltersParsers = {
  category: parseAsString.withDefault('all').withOptions({ shallow: false }),
  page: parseAsInteger.withDefault(1).withOptions({ shallow: false }),
}

export const blogFiltersCache = createSearchParamsCache(blogFiltersParsers)
