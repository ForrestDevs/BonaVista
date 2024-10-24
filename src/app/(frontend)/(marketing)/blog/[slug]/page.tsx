import type { Metadata } from 'next'

import { RelatedPosts } from '@/components/payload/blocks/RelatedPosts'
import { PayloadRedirects } from '@/components/payload/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/payload/RichText'
import type { Post } from '@/payload-types'

import { PostHero } from '@/components/payload/heros/PostHero'
import { generateMeta } from '@/lib/utils/generateMeta'

// export async function generateStaticParams() {
//   const payload = await getPayloadHMR({ config: configPromise })
//   const posts = await payload.find({
//     collection: 'posts',
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//   })

//   return posts.docs?.map(({ slug }) => slug)
// }

type Params = Promise<{ slug: string | undefined }>

export default async function Post({ params }: { params: Params }) {
  const { slug } = await params
  const url = '/blog/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      {/* Allows redirects for valid pages too */}
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

  return generateMeta({ doc: post, collectionSlug: 'posts' })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    // draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
