import React, { cache } from 'react'
import type { Metadata } from 'next'
import getPayload from '@lib/utils/getPayload'

import { RelatedPosts } from '@/components/payload/blocks/RelatedPosts'
import { PayloadRedirects } from '@/components/payload/PayloadRedirects'
import { draftMode } from 'next/headers'

import RichText from '@/components/payload/RichText'
import type { Post } from '@/payload-types'

import { PostHero } from '@/components/payload/heros/PostHero'
import { generateMeta } from '@/lib/utils/generateMeta'
import { POST_SLUG } from '@/payload/collections/constants'
import { queryPostBySlug } from '@/lib/utils/queryBySlug'

export async function generateStaticParams() {
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: POST_SLUG,
    draft: false,
    overrideAccess: false,
  })

  const postSlugs = docs.map((post) => {
    return {
      slug: post.slug ?? '',
    }
  })

  return postSlugs
}

type Params = Promise<{ slug: string | undefined }>

export default async function Post({ params }: { params: Params }) {
  const { slug } = await params
  const url = '/blog/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PayloadRedirects disableNotFound url={url} />
      <PostHero post={post} />
      <div className="flex flex-col gap-4 pt-8">
        <div className="container lg:grid lg:grid-cols-[1fr_48rem_1fr] grid-rows-[1fr]">
          <RichText
            className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
            content={post.content}
            enableGutter={false}
          />
        </div>

        <RelatedPosts
          className="mt-12"
          docs={post.relatedPosts?.filter((post) => typeof post === 'object')}
        />
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post, collectionSlug: POST_SLUG })
}
