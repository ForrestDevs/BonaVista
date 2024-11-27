import {
  parseAsString,
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
} from 'nuqs/server'

export const filterParamsParsers = {
  search: parseAsString.withOptions({ clearOnDefault: true, shallow: false }).withDefault(""),
  seats: parseAsArrayOf(parseAsInteger).withOptions({ clearOnDefault: true, shallow: false }).withDefault([2,6]),
  price: parseAsArrayOf(parseAsInteger).withOptions({ clearOnDefault: true, shallow: false }).withDefault([20000,50000]),
  collections: parseAsArrayOf(parseAsString).withOptions({ clearOnDefault: true, shallow: false }).withDefault([]),
}
export const filterParamsCache = createSearchParamsCache(filterParamsParsers) 