import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/payload/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import type { Page as PageType } from '@/payload-types'
import { RenderBlocks } from '@components/payload/blocks'
import { RenderHero } from '@components/payload/heros'
import { generateMeta } from '@/lib/utils/generateMeta'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => slug)
}

type Params = Promise<{ slug: string | undefined }>

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params
  const url = '/' 

  console.log('slug page', slug)
  console.log('url page', url)

  let page: PageType | null

  page = await queryPageBySlug({
    slug: slug ? slug : '',
  })

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params

  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page, collectionSlug: 'pages' })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  // const { isEnabled: draft } = draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    // draft,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
