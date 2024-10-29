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
    <section className="container w-full bg-white">
      <h3 className="text-sm font-thin tracking-widest text-gray-600 mb-2 uppercase">{subtitle}</h3>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="flex flex-col md:flex-row md:items-end md:justify-start mb-6">
        <p className="text-gray-700 md:mb-0 max-w-2xl">{body}</p>
        <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
          <CMSLink {...link} className="rounded-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <PostCard key={index} doc={post} showCategories />
        ))}
      </div>
    </section>
  )
}
