import { parseAsString, createSearchParamsCache, parseAsArrayOf, parseAsInteger } from 'nuqs/server'

export const hotTubSearchParamsParsers = {
  search: parseAsString.withOptions({ clearOnDefault: true, shallow: false }).withDefault(''),
  seats: parseAsArrayOf(parseAsInteger)
    .withOptions({ clearOnDefault: true, shallow: false })
    .withDefault([3, 8]),
  price: parseAsArrayOf(parseAsInteger)
    .withOptions({ clearOnDefault: true, shallow: false })
    .withDefault([10000, 22000]),
  collections: parseAsArrayOf(parseAsString)
    .withOptions({ clearOnDefault: true, shallow: false })
    .withDefault([]),
}
export const hotTubSearchParamsCache = createSearchParamsCache(hotTubSearchParamsParsers)
