import React from 'react'
import getPayload from '@/lib/utils/getPayload'
import { queryPageBySlug } from '@/lib/utils/queryPageBySlug'
import { RenderHero } from '@/components/payload/heros'
import { RenderBlocks } from '@/components/payload/blocks'

export default async function ShopHotTubsHome() {
  const payload = await getPayload()
  const page = await queryPageBySlug({ slug: 'shop-hot-tubs' })

  return (
    <div className="flex flex-col min-h-screen space-y-10">
      <RenderHero {...page.hero} />
      <section className="container">
        <RenderBlocks blocks={page.layout} />
      </section>
    </div>
  )
}
