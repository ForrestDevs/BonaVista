import { parseAsString, createSearchParamsCache, parseAsArrayOf, parseAsInteger } from 'nuqs/server'

export const swimSpaSearchParamsParsers = {
  search: parseAsString.withOptions({ clearOnDefault: true, shallow: false }).withDefault(''),
  length: parseAsArrayOf(parseAsInteger)
    .withOptions({ clearOnDefault: true, shallow: false })
    .withDefault([13, 19]),
  price: parseAsArrayOf(parseAsInteger)
    .withOptions({ clearOnDefault: true, shallow: false })
    .withDefault([20000, 60000]),
  collections: parseAsArrayOf(parseAsString)
    .withOptions({ clearOnDefault: true, shallow: false })
    .withDefault([]),
}
export const swimSpaSearchParamsCache = createSearchParamsCache(swimSpaSearchParamsParsers)
