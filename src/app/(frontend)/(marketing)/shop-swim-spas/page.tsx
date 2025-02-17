import React from 'react'
import { queryPageBySlug } from '@/lib/utils/queryBySlug'
import { RenderHero } from '@/components/payload/heros'
import { RenderBlocks } from '@/components/payload/blocks'
import { SearchParams } from 'nuqs'
import SwimSpaList from '@/components/marketing/spas/swim-spa/swim-spa-list'
import { notFound } from 'next/navigation'

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function ShopSwimSpasHome({ searchParams }: PageProps) {
  const page = await queryPageBySlug('shop-swim-spas')

  if (!page) {
    return notFound()
  }

  return (
    <div className="flex flex-col min-h-screen gap-20">
      <RenderHero {...page.hero} />
      <section className="container flex flex-col items-center text-center gap-4">
        <p className="text-md font-medium text-primary tracking-wide">Browse Our Collection</p>
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
          Find Your Perfect Swim Spa
        </h1>
        <p className="mx-auto max-w-5xl text-lg text-muted-foreground">
          Discover our extensive range of premium swim spas, designed for fitness, relaxation, and
          year-round enjoyment. Use our filters to find the perfect match for your lifestyle.
        </p>
      </section>
      <SwimSpaList searchParams={searchParams} />
      <RenderBlocks blocks={page.layout} />
    </div>
  )
}
