import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/payload/PayloadRedirects'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import type { Page as PageType } from '@/payload-types'
import { RenderBlocks } from '@components/payload/blocks'
import { RenderHero } from '@components/payload/heros'
import { generateMeta } from '@/lib/utils/generateMeta'
import getPayload from '@/lib/utils/getPayload'
import { notFound } from 'next/navigation'
import { queryPageBySlug } from '@/lib/utils/queryBySlug'
import type { RequiredDataFromCollectionSlug } from 'payload'
import { PAGE_SLUG } from '@/payload/collections/constants'

type Args = {
  params: Promise<{
    slug?: string[] | undefined
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  let { slug = ['home'] } = await paramsPromise
  if (!slug) slug = ['']
  const lastSlug = slug[slug.length - 1]
  const url = '/' + slug

  let page: RequiredDataFromCollectionSlug<typeof PAGE_SLUG> | null

  page = await queryPageBySlug(lastSlug)

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pb-24">
      <PayloadRedirects disableNotFound url={url} />
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await paramsPromise
  const slug = params.slug || ['home']
  const lastSlug = slug[slug.length - 1]

  const page = await queryPageBySlug(lastSlug)

  return generateMeta({ doc: page, collectionSlug: PAGE_SLUG })
}

export async function generateStaticParams() {
  let paths: { slug: string[] }[] = []
  const payload = await getPayload()

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  if (pages && Array.isArray(pages) && pages.length > 0) {
    paths = pages.docs
      .filter((doc) => {
        return doc.slug !== 'home'
      })
      .map((page) => {
        const { slug, breadcrumbs } = page

        let slugs = [slug]

        const hasBreadcrumbs = breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0

        if (hasBreadcrumbs) {
          slugs = breadcrumbs
            .map((crumb) => {
              const { url } = crumb
              let slug: string = ''

              if (url) {
                const split = url.split('/')
                slug = split[split.length - 1]
              }

              return slug
            })
            ?.filter(Boolean)
        }

        return { slug: slugs }
      })
  }

  return paths
}
