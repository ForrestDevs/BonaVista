import { unstable_cache } from 'next/cache'
import getPayload from '@/lib/utils/getPayload'
import { PRODUCT_SLUG } from '@/payload/collections/constants'
import { PaginatedDocs } from 'payload'
import { Product } from '@payload-types'

export const searchProducts = unstable_cache(uncachedSearchProducts, ['search', 'products'], {
  tags: ['search', 'products'],
})

async function uncachedSearchProducts(query: string) {
  const payload = await getPayload()
  const products = await payload.find({
    collection: PRODUCT_SLUG,
    limit: 100,
  })
  const searchResults = simpleSearch(products, query)
  return searchResults.map((sr) => products.docs.find((p) => p.id === sr.id)).filter(Boolean)
}

const NO_MATCH = 0
const EXACT_MATCH = 5
const EXACT_WORD_MULTIPLIER = 2

// https://stackoverflow.com/a/9310752
function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function simpleSearchMatch(query: string, value: null | undefined | string): number {
  if (!value) {
    return NO_MATCH
  }
  if (value === query) {
    return EXACT_MATCH
  }

  const allWords = value.split(' ').length || 1
  const exactRegExp = new RegExp(`\\b${query}\\b`, 'ig')
  const includesRegExp = new RegExp(query, 'ig')

  const exactWordOccurrences = [...value.toString().matchAll(exactRegExp)].length
  const includesOccurrences = [...value.toString().matchAll(includesRegExp)].length
  return (EXACT_WORD_MULTIPLIER * exactWordOccurrences + includesOccurrences) / allWords
}

export function simpleSearch(products: PaginatedDocs<Product>, query: string) {
  const escapedQuery = escapeRegExp(query)
  const matches = products.docs
    .flatMap((product) => {
      const fieldsWithWeights = [
        [product.title, 1.5],
        [product.slug, 1],
        // [product.description, 1],
        // [product.categories, 1],
        // [product.collections, 1],
        // [product.keywords, 1],
      ] as const

      const score = fieldsWithWeights
        .map(([field, weight]) => {
          return weight * simpleSearchMatch(escapedQuery, field)
        })
        .reduce((score, match) => score + match, 0)

      if (score > 0) {
        return { id: product.id, score }
      }
      return []
    })
    .sort((a, b) => {
      return b.score - a.score
    })

  return matches
}
