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

export default async function ShopHotTubsHome() {
  const payload = await getPayload()
  const page = await queryPageBySlug({ slug: 'shop-hot-tubs' })

  const { docs } = await payload.find({
    collection: 'spas',
    where: {
      type: { equals: 'hot-tub' },
    },
    sort: ['title'],
    limit: 25,
  })

  return (
    <div className="flex flex-col min-h-screen space-y-10">
      <RenderHero {...page.hero} />
      <section className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((spa) => (
            <SpaCard key={spa.id} spa={spa} />
          ))}
        </div>

        <RenderBlocks blocks={page.layout} />
      </section>
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
