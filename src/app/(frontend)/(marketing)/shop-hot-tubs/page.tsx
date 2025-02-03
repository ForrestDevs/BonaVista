import React from 'react'
import getPayload from '@/lib/utils/getPayload'
import { queryPageBySlug } from '@/lib/utils/queryPageBySlug'
import { RenderHero } from '@/components/payload/heros'
import { RenderBlocks } from '@/components/payload/blocks'
import { Spa } from '@payload-types'
import { Media } from '@/components/payload/Media'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ArrowUpRight, Users, Droplets } from 'lucide-react'
import SpaFilters from './components/filter'
import { SearchParams } from 'nuqs'
import { filterParamsCache } from './searchParams'

type PageProps = {
  searchParams: Promise<SearchParams> // Next.js 15+: async searchParams prop
}

export default async function ShopHotTubsHome({ searchParams }: PageProps) {
  const [payload, page, { search, seats, price, collections }, { docs }] = await Promise.all([
    getPayload(),
    queryPageBySlug('shop-hot-tubs'),
    filterParamsCache.parse(searchParams),
    (await getPayload()).find({
      collection: 'spas',
      where: {
        type: { equals: 'hot-tub' },
      },
      sort: ['hotTubCollection'],
      limit: 25,
    }),
  ])

  const filterSpas = (
    docs: Spa[],
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

      // Price filter
      if (price[0] !== 0 || price[1] !== 20000) {
        const actualPrice = (spa.startingPrice || 0) * 1000
        if (actualPrice < price[0] || actualPrice > price[1]) return false
      }

      // Collection filter
      if (collections.length > 0 && !collections.join(',').includes(spa.hotTubCollection)) {
        return false
      }

      return true
    })
  }
  const filteredDocs = filterSpas(docs, { search, seats, price, collections })

  return (
    <div className="flex flex-col min-h-screen gap-20">
      <RenderHero {...page.hero} />
      <section className="container flex flex-col items-center text-center gap-4">
        <p className="text-md font-medium text-primary tracking-wide">Browse Our Collection</p>
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
          Find Your Perfect Hot Tub
        </h1>
        <p className="mx-auto max-w-5xl text-lg text-muted-foreground">
          Discover our extensive range of premium hot tubs, designed to bring relaxation and luxury
          to your home. Use our filters to find the perfect match for your space and lifestyle.
        </p>
      </section>

      <section className="container flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[250px] sticky top-24 z-10">
          <SpaFilters />
        </aside>
        <div className="flex-1">
          {filteredDocs.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {filteredDocs.map((spa) => (
                <SpaCard key={spa.id} spa={spa} />
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
      <RenderBlocks blocks={page.layout} />
    </div>
  )
}

function SpaCard({ spa }: { spa: Spa }) {
  return (
    <Card className="max-w-sm mx-auto overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="aspect-square relative rounded-lg overflow-hidden">
          {spa.thumbnail && (
            <Link href={`/shop-hot-tubs/${spa.slug}`}>
              <Media
                resource={spa.thumbnail}
                imgClassName="object-cover transition-transform hover:scale-105"
              />
            </Link>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-center">
            {spa.title}
            <span className="text-muted-foreground">™</span>
          </h2>
          <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{spa.seating}</span>
            </div>
            <div className="flex items-center">
              <Droplets className="w-4 h-4 mr-1" />
              <span>{spa.jets} Jets</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 p-4">
        <Link href={`/shop-hot-tubs/${spa.slug}`} className="w-full group">
          <div className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <span className="mr-2">View Details + Price</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-100 ease-in-out group-hover:rotate-45" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  )
}
