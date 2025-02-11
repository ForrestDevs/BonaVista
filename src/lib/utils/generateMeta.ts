import type { Metadata } from 'next'
import type { Page, Post, Spa } from '@payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { generateMetadata } from '@/app/(frontend)/layout'
import { PAGE_SLUG, POST_SLUG, SPA_SLUG } from '@/payload/collections/constants'

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Spa> | null
  collectionSlug: string
}): Promise<Metadata> => {
  const { doc, collectionSlug } = args || {}

  const defaultMetaData = await generateMetadata()

  const ogImage =
    doc?.meta?.image &&
    typeof doc.meta.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  const title = doc?.meta?.title
    ? doc?.meta?.title
    : defaultMetaData.title
      ? defaultMetaData.title
      : 'BonaVista LeisureScapes'

  let url = `${process.env.NEXT_PUBLIC_PUBLIC_URL}`
  if (collectionSlug === PAGE_SLUG) {
    url = `${process.env.NEXT_PUBLIC_PUBLIC_URL}/${doc?.slug}`
  } else if (collectionSlug === POST_SLUG) {
    url = `${process.env.NEXT_PUBLIC_PUBLIC_URL}/blog/${doc?.slug}`
  } else if (collectionSlug === SPA_SLUG) {
    const isHotTub = (doc as Partial<Spa>)?.type === 'hot-tub'
    url = `${process.env.NEXT_PUBLIC_PUBLIC_URL}${isHotTub ? '/shop-hot-tubs' : '/shop-swim-spas'}/${doc?.slug}`
  }

  return {
    title,
    description: doc?.meta?.description || defaultMetaData.description,
    openGraph: mergeOpenGraph({
      title,
      description: doc?.meta?.description ?? 'BonaVista LeisureScapes',
      url,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      creator: '@bonavistaleisurescapes',
    },
  }
}
