import React from 'react'
import getPayload from '@/lib/utils/getPayload'
import BlogFiltersClient from './client'

export default async function BlogFilters() {
  const payload = await getPayload()

  const categories = await payload.find({
    collection: 'blog-categories',
    depth: 0,
    where: {
      showInFilter: {
        equals: true,
      },
    },
  })

  return <BlogFiltersClient categories={categories.docs} />
}
