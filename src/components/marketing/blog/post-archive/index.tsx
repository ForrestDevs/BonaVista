import React from 'react'
import type { Post } from '@/payload-types'
import { PostCard } from '@/components/marketing/blog/post-card'

type Args = {
  posts: Post[]
}

export function PostArchive({ posts }: Args) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div className="col-span-4" key={index}>
              <PostCard className="h-full" doc={result} showCategories />
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
