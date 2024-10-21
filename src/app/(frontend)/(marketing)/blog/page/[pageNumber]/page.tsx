import type { Metadata } from 'next/types'

import { PostArchive } from '@/components/marketing/blog/post-archive'
import { PageRange } from '@/components/marketing/blog/pagination/page-range'
import { Pagination } from '@/components/marketing/blog/pagination'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

type Params = Promise<{ pageNumber: string | undefined }>

export default async function Page({ params }: { params: Params }) {
  const { pageNumber } = await params
  const payload = await getPayloadHMR({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: parseInt(pageNumber),
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <PostArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && (
          <Pagination page={posts.page ?? 0} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { pageNumber } = await params
  return {
    title: `Payload Website Template Posts Page ${pageNumber}`,
  }
}

// export async function generateStaticParams() {
//   const payload = await getPayloadHMR({ config: configPromise })
//   const posts = await payload.find({
//     collection: 'posts',
//     depth: 0,
//     limit: 10,
//   })

//   const pages = []

//   for (let i = 1; i <= posts.totalPages; i++) {
//     pages.push(i)
//   }

//   return pages
// }
