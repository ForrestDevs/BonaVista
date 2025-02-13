import React from 'react'
import { swimSpaSearchParamsCache } from './swim-spa-search-params'
import { Spa } from '@payload-types'
import { SearchParams } from 'nuqs'
import SpaFilters from './swim-spa-filters'
import getPayload from '@/lib/utils/getPayload'
import { SPA_SLUG } from '@/payload/collections/constants'
import { cache } from '@/lib/utils/cache'
import { SpaCard } from '../spa-card'

async function getCachedSpas() {
  const payload = await getPayload()
  const cacheFn = cache(
    async () => {
      const { docs } = await payload.find({
        collection: SPA_SLUG,
        where: { type: { equals: 'swim-spa' } },
        select: {
          slug: true,
          thumbnail: true,
          title: true,
          seating: true,
          jets: true,
          startingPrice: true,
          swimSpaCollection: true,
          sizeCategory: true,
          swimSystem: true,
        },
        limit: 100,
      })

      return docs
    },
    {
      tags: ['get-swim-spas'],
    },
  )

  return await cacheFn()
}

export default async function SwimSpaList({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { search, length, price, collections } = await swimSpaSearchParamsCache.parse(searchParams)
  const docs = await getCachedSpas()
  const filterSpas = (
    docs: Pick<
      Spa,
      | 'id'
      | 'slug'
      | 'title'
      | 'seating'
      | 'jets'
      | 'startingPrice'
      | 'swimSpaCollection'
      | 'thumbnail'
      | 'sizeCategory'
      | 'swimSystem'
    >[],
    {
      search,
    }: {
      search: string
      length: number[]
      price: number[]
      collections: string[]
    },
  ) => {
    return docs.filter((spa) => {
      // Search filter
      if (
        search !== '' &&
        (!spa.title || !spa.title.toLowerCase().includes(search.toLowerCase()))
      ) {
        return false
      }

      // Seats filter
      if ((length[0] !== 13 || length[1] !== 19) && spa.sizeCategory) {
        // Extract number from string like "19' model"
        const sizeMatch = spa.sizeCategory.match(/(\d+)/)
        if (!sizeMatch) return false

        const sizeNumber = parseInt(sizeMatch[1])
        if (isNaN(sizeNumber)) return false

        // Check if size is within selected range
        if (sizeNumber < length[0] || sizeNumber > length[1]) {
          return false
        }
      }

      // Price filter
      if (price[0] !== 20000 || price[1] !== 60000) {
        const actualPrice = spa.startingPrice || 0
        if (actualPrice < price[0] || actualPrice > price[1]) return false
      }

      // Collection filter
      if (collections.length > 0 && !collections.join(',').includes(spa.swimSpaCollection)) {
        return false
      }

      return true
    })
  }
  const filteredDocs = filterSpas(docs, { search, length, price, collections })

  return (
    <section className="container flex flex-col lg:flex-row gap-6">
      <aside className="w-full lg:w-[250px] sticky top-24 z-10">
        <SpaFilters />
      </aside>
      <div className="flex-1">
        {filteredDocs.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDocs.map((spa) => (
              <SpaCard key={spa.id} spa={spa} type="swim-spa" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Swim Spas Found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
