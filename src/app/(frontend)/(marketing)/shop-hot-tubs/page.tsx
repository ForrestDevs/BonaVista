import React from 'react'
import getPayload from '@/lib/utils/getPayload'
import { queryPageBySlug } from '@/lib/utils/queryPageBySlug'
import { RenderHero } from '@/components/payload/heros'
import { RenderBlocks } from '@/components/payload/blocks'
import { Spa } from '@payload-types'
import { Media } from '@/components/payload/Media'
import Link from 'next/link'

export default async function ShopHotTubsHome() {
  const payload = await getPayload()
  const page = await queryPageBySlug({ slug: 'shop-hot-tubs' })

  const { docs } = await payload.find({
    collection: 'spas',
    where: {
      type: { equals: 'hot-tub' },
    },
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
    <Link className="group relative" href={`/shop-hot-tubs/${spa.slug}`}>
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Media resource={spa.thumbnail} fill />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href={`/shop-hot-tubs/${spa.slug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {spa.title}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{spa.seating} Seats</p>
          <p className="mt-1 text-sm text-gray-500">{spa.jets} Jets</p>
        </div>
      </div>
    </Link>
  )
}
