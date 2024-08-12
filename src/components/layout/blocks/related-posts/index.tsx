import React from 'react'

import { cn } from '@/lib/utils/cn'
import type { Post } from '@/payload-types'
import RichText from '@/components/layout/rich-text'
import { PostCard } from '@/components/marketing/blog/post-card'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: any
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={cn('container', className)}>
      {introContent && <RichText content={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <PostCard key={index} doc={doc} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}
