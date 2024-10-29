'use client'

import React, { useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { BlogCategory } from '@payload-types'
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
import { blogFiltersParsers } from '../searchParams'

export default function BlogFilters({ categories }: { categories: BlogCategory[] }) {
  const [{ category: currentCategory }, setCurrentCategory] = useQueryStates(blogFiltersParsers)

  // const searchParams = useSearchParams()
  // const pathname = usePathname()
  // const { replace } = useRouter()
  // const [selectedCategory, setSelectedCategory] = useState('all')

  // function handleCategoryChange(category: string) {
  //   const params = new URLSearchParams(searchParams)
  //   if (category !== 'all') {
  //     params.set('category', category)
  //   } else {
  //     params.delete('category')
  //   }
  //   replace(`${pathname}?${params.toString()}`, { scroll: false })
  //   setSelectedCategory(category)
  // }

  return (
    <div className="container">
      <div className="hidden md:flex flex-wrap justify-center gap-4">
        <Button
          onClick={() => setCurrentCategory({ category: 'all' })}
          className={clsx(
            'p-7 text-lg rounded-none hover:text-white',
            currentCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-black',
          )}
          variant="default"
          size="lg"
        >
          All
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setCurrentCategory({ category: category.slug })}
            className={clsx(
              'p-7 text-lg rounded-none hover:text-white',
              currentCategory === category.slug
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-black',
            )}
            variant="default"
            size="lg"
          >
            {category.title}
          </Button>
        ))}
      </div>

      <div className="md:hidden">
        <Select
          onValueChange={(value) => setCurrentCategory({ category: value })}
          defaultValue="all"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
