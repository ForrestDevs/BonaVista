import React, { Suspense } from 'react'
import GalleryFilters from '@/components/marketing/gallery/filter'
import { GalleryArchive } from '@/components/marketing/gallery/gallery-archive'
import getPayload from '@/lib/utils/getPayload'
import { StandardHero } from '@/components/payload/heros/Standard'
import { RenderHero } from '@/components/payload/heros'
import { RenderBlocks } from '@/components/payload/blocks'
import { queryPageBySlug } from '@/lib/utils/queryPageBySlug'

export default async function GalleryHome() {
  const payload = await getPayload()
  const page = await queryPageBySlug({ slug: 'gallery' })
  const { docs } = await payload.find({
    collection: 'galleries',
    depth: 1,
  })

  return (
    <div className="flex flex-col min-h-screen space-y-10">
      <RenderHero {...page.hero} />
      <section className="container">
        <RenderBlocks blocks={page.layout} />
      </section>
      <Suspense fallback={<div>Loading...</div>}>
        <GalleryFilters collections={docs} />
        <GalleryArchive collections={docs} />
      </Suspense>
    </div>
  )
}
