import type { Metadata } from 'next'

import type { Page, Post } from '@/payload-types'

import { mergeOpenGraph } from './merge-open-graph'
import { generateMetadata } from '@/app/(frontend)/layout'

export const generateMeta = async (args: {
  doc: Page | Post | null
  collectionSlug: string
}): Promise<Metadata> => {
  const { doc, collectionSlug } = args || {}

  const defaultMetaData = await generateMetadata()

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  const title = doc?.meta?.title
    ? doc?.meta?.title + ` | ${defaultMetaData.title}`
    : defaultMetaData.title? defaultMetaData.title : 'BonaVista LeisureScapes'

  const url = `${process.env.NEXT_PUBLIC_PUBLIC_URL}/${collectionSlug}/${doc?.id}`

  return {
    title,
    description: doc?.meta?.description || defaultMetaData?.description,
    openGraph: mergeOpenGraph({
      title,
      description: doc?.meta?.description ?? "We're here to help you create your dream backyard.",
      url,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
  }
}
