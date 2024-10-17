import React from 'react'
import { Suspense } from 'react'
import { SearchIcon } from 'lucide-react'
import {
  SearchInput,
  SearchInputPlaceholder,
} from '@components/layout/headers/shop/Search/search-input'

export function SearchBar() {
  return (
    <label className="flex w-full items-center">
      <span className="sr-only">Search</span>
      <SearchIcon className="-ml-7 block h-5 w-5" />
      <Suspense fallback={<SearchInputPlaceholder placeholder="Search" />}>
        <SearchInput placeholder="Search" />
      </Suspense>
    </label>
  )
}
