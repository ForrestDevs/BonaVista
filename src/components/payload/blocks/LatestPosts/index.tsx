import React from 'react'

import type { Page } from '@payload-types'
import { Button } from '@/components/ui/button'
import { Link } from '@radix-ui/react-navigation-menu'
import getPayload from '@/lib/utils/getPayload'
import { POST_SLUG } from '@/payload/collections/constants'
import { PostCard } from '@/components/marketing/blog/post-card'
import { CMSLink } from '../../Link'

type Props = Extract<Page['layout'][0], { blockType: 'latest-posts' }>

export const LatestPostsBlock: React.FC<
  {
    id?: string
  } & Props
> = async (props) => {
  const { title, subtitle, body, link } = props

  const payload = await getPayload()

  const { docs: blogPosts } = await payload.find({
    collection: POST_SLUG,
    limit: 3,
    sort: '-createdAt',
  })

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-sm md:text-base font-light tracking-wider uppercase text-primary mb-3 md:mb-4">
          {subtitle}
        </h3>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight tracking-tight">
          {title}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <p className="text-base md:text-lg leading-relaxed text-gray-700 max-w-3xl">
            {body}
          </p>
          <div className="flex-shrink-0">
            <CMSLink
              {...link}
              className="transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
              size="lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {blogPosts.map((post, index) => (
            <PostCard 
              key={index} 
              doc={post} 
              showCategories 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
