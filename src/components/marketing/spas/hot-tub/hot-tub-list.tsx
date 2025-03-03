import React, { Suspense } from 'react'
import HotTubFilters from './hot-tub-filters'
import { Spa } from '@payload-types'
import { hotTubSearchParamsCache } from './hot-tub-search-params'
import { SearchParams } from 'nuqs'
import getPayload from '@/lib/utils/getPayload'
import { SPA_SLUG } from '@/payload/collections/constants'
import { SpaCard } from '../spa-card'
import { cache } from '@/lib/utils/cache'
import LoadingSpas from '@/components/layout/suspense/loading-spas'

type PageProps = {
  searchParams: Promise<SearchParams>
}

async function getCachedSpas() {
  const payload = await getPayload()
  const cacheFn = cache(
    async () => {
      const { docs } = await payload.find({
        collection: SPA_SLUG,
        where: { type: { equals: 'hot-tub' } },
        select: {
          slug: true,
          thumbnail: true,
          title: true,
          seating: true,
          jets: true,
          startingPrice: true,
          hotTubCollection: true,
        },
        limit: 100,
      })

      return docs
    },
    {
      tags: ['get-hot-tubs'],
    },
  )

  return await cacheFn()
}

export default async function HotTubList({ searchParams }: PageProps) {
  const { search, seats, price, collections } = await hotTubSearchParamsCache.parse(searchParams)
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
      | 'hotTubCollection'
      | 'thumbnail'
    >[],
    {
      search,
      seats,
      price,
      collections,
    }: {
      search: string
      seats: number[]
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
      if ((seats[0] !== 3 || seats[1] !== 8) && spa.seating) {
        const seatingStr = spa.seating
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/persons?/g, '')

        let minSeats: number, maxSeats: number

        if (seatingStr.includes('-')) {
          ;[minSeats, maxSeats] = seatingStr.split('-').map(Number)
        } else {
          minSeats = maxSeats = parseInt(seatingStr)
        }

        const isInRange =
          seats[0] === seats[1]
            ? minSeats <= seats[0] && maxSeats >= seats[0]
            : !(maxSeats < seats[0] || minSeats > seats[1])

        if (!isInRange) return false
      }

      //   // Price filter
      if (price[0] !== 0 || price[1] !== 22000) {
        const actualPrice = spa.startingPrice || 0
        if (actualPrice < price[0] || actualPrice > price[1]) return false
      }

      //   // Collection filter
      if (collections.length > 0 && !collections.join(',').includes(spa.hotTubCollection)) {
        return false
      }

      return true
    })
  }
  const filteredDocs = filterSpas(docs, { search, seats, price, collections })

  return (
    <Suspense fallback={<LoadingSpas />}>
      <section className="container flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[250px] sticky top-24 z-10">
          <HotTubFilters />
        </aside>
        <div className="flex-1">
          {filteredDocs.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {filteredDocs.map((spa) => (
                <SpaCard key={spa.id} spa={spa} type="hot-tub" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No Hot Tubs Found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>
      </section>
    </Suspense>
  )
}
