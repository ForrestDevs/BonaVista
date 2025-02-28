import { parseAsString, createSearchParamsCache } from 'nuqs/server'

export const gallerySearchParamsParsers = {
  collection: parseAsString.withOptions({ clearOnDefault: true }).withDefault('swim-spas'),
}

export const gallerySearchParamsCache = createSearchParamsCache(gallerySearchParamsParsers)
