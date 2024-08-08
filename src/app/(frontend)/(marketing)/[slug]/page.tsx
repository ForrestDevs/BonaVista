import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/payload/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from 'src/payload/seed/home-static'

import type { Page as PageType } from '@/payload-types'

import { Blocks } from '@/components/payload/Blocks'
import { Hero } from '@/components/payload/Hero'

import { generateMeta } from '@/lib/utils/generateMeta'

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

export default async function Page({ params: { slug = 'home' } }) {
  const url = '/' + slug

  let page: PageType | null

  page = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <Hero {...hero} />
      <Blocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page, collectionSlug: 'pages' })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
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
