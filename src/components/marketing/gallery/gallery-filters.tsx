'use client'

import React from 'react'
import { Gallery } from '@payload-types'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { parseAsString, useQueryStates } from 'nuqs'
import getPayload from '@/lib/utils/getPayload'
import { GALLERIES_SLUG } from '@/payload/collections/constants'
import { gallerySearchParamsParsers } from './gallery-search-params'

type GalleryFiltersProps = {
  collections: Pick<Gallery, 'id' | 'title' | 'slug'>[]
}

export default function GalleryFilters({ collections }: GalleryFiltersProps) {
  const [currentCollection, setCurrentCollection] = useQueryStates(gallerySearchParamsParsers)

  return (
    <section className="container">
      <div className="hidden md:flex flex-wrap justify-center gap-4">
        {collections.map((collection) => (
          <Button
            key={collection.id}
            onClick={() => setCurrentCollection({ collection: collection.slug })}
            className={clsx(
              'p-7 text-lg rounded-none hover:text-white',
              currentCollection.collection === collection.slug
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-black',
            )}
            variant="default"
            size="lg"
          >
            {collection.title}
          </Button>
        ))}
      </div>

      <div className="md:hidden">
        <Select
          onValueChange={(value) => setCurrentCollection({ collection: value })}
          defaultValue={currentCollection.collection}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a collection" />
          </SelectTrigger>
          <SelectContent>
            {collections.map((collection) => (
              <SelectItem key={collection.id} value={collection.slug}>
                {collection.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
