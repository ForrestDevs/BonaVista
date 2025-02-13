'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils/cn'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { DualRangeSlider } from '@/components/ui/slider'
import { RangeLabel } from '@/components/ui/slider'
import { useQueryStates } from 'nuqs'
import { swimSpaSearchParamsParsers } from './swim-spa-search-params'
import { useState } from 'react'

const lengthOptions = {
  min: 13,
  max: 19,
  step: 1,
}

const priceOptions = {
  min: 20000,
  max: 60000,
  step: 1000,
}

const collectionOptions = [
  { name: 'Executive Trainer', slug: 'executive-trainer' },
  { name: 'Executive Sport', slug: 'executive-sport' },
  { name: 'Aqua Trainer', slug: 'aqua-trainer' },
  { name: 'Aqua Sport', slug: 'aqua-sport' },
  { name: 'Aqua Play', slug: 'aqua-play' },
]

export default function SpaFilters() {
  const [isOpen, setIsOpen] = useState(false)
  const [filterParams, setFilterParams] = useQueryStates(swimSpaSearchParamsParsers)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterParams({ search: e.target.value || '' })
    },
    [setFilterParams],
  )

  const handleLengthChange = useCallback(
    (value: number[]) => {
      setFilterParams({ length: value })
    },
    [setFilterParams],
  )

  const handlePriceChange = useCallback(
    (value: number[]) => {
      setFilterParams({ price: value })
    },
    [setFilterParams],
  )

  const handleCollectionsChange = useCallback(
    (option: { slug: string }, checked: boolean | string) => {
      setFilterParams((prev) => ({
        collections: checked
          ? [...(prev.collections || []), option.slug]
          : (prev.collections || []).filter((slug) => slug !== option.slug),
      }))
    },
    [setFilterParams],
  )

  return (
    <div className="lg:block">
      {/* Mobile Filter Trigger */}
      <button
        className="lg:hidden w-full flex items-center justify-between p-4 bg-white rounded-lg shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Filters</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter Content */}
      <div
        className={cn(
          'space-y-6 p-4 bg-white rounded-lg shadow h-fit',
          'lg:block',
          'fixed lg:static inset-x-0 bottom-0 z-50',
          'transition-transform duration-300',
          isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0',
        )}
      >
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="search"
            type="search"
            placeholder="Search swim spas..."
            value={filterParams.search ?? ''}
            onChange={handleSearchChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Collection</Label>
          <div>
            {collectionOptions.map((option) => {
              const checked = filterParams.collections?.includes(option.slug) ?? false

              return (
                <div
                  key={String(option.slug)}
                  className={cn(
                    'group relative flex items-center space-x-2 px-2 py-2.5 hover:bg-accent',
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(checked) => handleCollectionsChange(option, checked)}
                  />
                  <Label>{option.name}</Label>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium">Length</p>
          <DualRangeSlider
            value={filterParams.length ?? [lengthOptions.min, lengthOptions.max]}
            onValueChange={handleLengthChange}
            min={lengthOptions.min}
            max={lengthOptions.max}
            step={lengthOptions.step}
          />
          <RangeLabel
            min={filterParams.length?.[0] ?? lengthOptions.min}
            max={filterParams.length?.[1] ?? lengthOptions.max}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium">Price Range</p>
          <DualRangeSlider
            value={filterParams.price ?? [priceOptions.min, priceOptions.max]}
            onValueChange={handlePriceChange}
            min={priceOptions.min}
            max={priceOptions.max}
            step={priceOptions.step}
          />
          <RangeLabel
            min={filterParams.price?.[0] ?? priceOptions.min}
            max={filterParams.price?.[1] ?? priceOptions.max}
            suffix="$"
          />
        </div>

        {/* Mobile Close Button */}
        <button
          className="lg:hidden w-full py-2 mt-4 bg-primary text-white rounded-lg"
          onClick={() => setIsOpen(false)}
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
