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

export default function GalleryFilters({ collections }: { collections: Gallery[] }) {
  const [currentCollection, setCurrentCollection] = useQueryStates({
    collection: parseAsString.withDefault(collections[0]?.slug).withOptions({
      clearOnDefault: false,
    }),
  })

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
