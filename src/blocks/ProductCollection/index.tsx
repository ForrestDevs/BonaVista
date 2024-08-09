import type { Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import React from 'react'
import RichText from '@/components/payload/RichText'
import type { ProductCollectionProps } from './types'
import { CollectionArchive } from '@/components/payload/CollectionArchive'

export const ProductCollectionBlock: React.FC<
  ProductCollectionProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit = 3, populateBy, selectedDocs } = props

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayloadHMR({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: limit || 3,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    posts =
      selectedDocs
        ?.map((post) => {
          if (typeof post.value === 'object') return post.value
        })
        .filter((post): post is Post => post !== undefined) || [] // Provide default value
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ml-0 max-w-[48rem]" content={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  )
}
