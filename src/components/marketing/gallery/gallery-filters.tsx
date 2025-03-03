'use client'

import React, { useTransition } from 'react'
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
import { useQueryState } from 'nuqs'
import { gallerySearchParamsParsers } from './gallery-search-params'

type GalleryFiltersProps = {
  collections: Pick<Gallery, 'id' | 'title' | 'slug'>[]
}

export default function GalleryFilters({ collections }: GalleryFiltersProps) {
  const [isPending, startTransition] = useTransition()
  const [currentCollection, setCurrentCollection] = useQueryState(
    'collection',
    gallerySearchParamsParsers.collection.withOptions({
      shallow: false,
      startTransition,
    }),
  )

  return (
    <section className="container">
      <div className="hidden md:flex flex-wrap justify-center gap-4">
        {collections.map((collection) => (
          <Button
            disabled={isPending}
            key={collection.id}
            onClick={() => setCurrentCollection(collection.slug)}
            className={clsx(
              'p-7 text-lg rounded-none hover:text-white',
              currentCollection === collection.slug
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
          onValueChange={(value) => setCurrentCollection(value)}
          defaultValue={currentCollection ?? ''}
          disabled={isPending}
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
