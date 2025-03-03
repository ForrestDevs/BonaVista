import { CollectionSlug, PayloadRequest } from 'payload'
import { previewAction } from '../data/preview'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/blog',
  pages: '',
  products: '/shop/product',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = async ({ collection, slug }: Props) => {
  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: `${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: process.env.NEXT_PUBLIC_DRAFT_SECRET || '',
  })

  const url = `/live-preview?${encodedParams.toString()}`

  return url
}
