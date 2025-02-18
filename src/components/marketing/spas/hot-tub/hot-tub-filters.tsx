'use client'

import React, { useState } from 'react'
import { useQueryStates } from 'nuqs'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils/cn'
import { Label } from '@/components/ui/label'
import { hotTubSearchParamsParsers } from './hot-tub-search-params'
import { RangeLabel, DualRangeSlider } from '@/components/ui/slider'

export default function HotTubFilters() {
  const [filterParams, setFilterParams] = useQueryStates(hotTubSearchParamsParsers)
  const [isOpen, setIsOpen] = useState(false)

  const seatOptions = {
    min: 3,
    max: 8,
    step: 1,
  }
  const priceOptions = {
    min: 10000,
    max: 22000,
    step: 500,
  }
  const collectionOptions = [
    { slug: 'self-cleaning', name: 'Self Cleaning' },
    { slug: 'serenity', name: 'Serenity' },
  ]

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterParams({ search: e.target.value })
  }

  const handleCollectionsChange = (
    option: { slug: string; name: string },
    checked: boolean | string,
  ) => {
    setFilterParams({
      collections: checked
        ? filterParams.collections
          ? [...filterParams.collections, option.slug]
          : [option.slug]
        : filterParams.collections?.filter((c) => c !== option.slug),
    })
  }

  const handleSeatsChange = (values: number[]) => {
    setFilterParams({ seats: values })
  }

  const handlePriceChange = (values: number[]) => {
    setFilterParams({ price: values })
  }

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
          'lg:block', // Always visible on lg+
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100', // Expand animation
        )}
      >
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="search"
            type="search"
            placeholder="Search hot tubs..."
            value={filterParams.search ?? ''}
            onChange={handleSearchChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Collection</Label>
          <div>
            {collectionOptions.map((option, index) => {
              const checked = filterParams.collections?.includes(option.slug) ?? false

              return (
                <div
                  key={String(option.slug)}
                  className={cn(
                    'group relative flex items-center space-x-2 px-2 py-2.5 hover:bg-accent',
                    //   index !== collectionOptions.length - 1 ? 'border-b' : undefined,
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
          <p className="text-sm font-medium">Number of Seats</p>
          <DualRangeSlider
            value={filterParams.seats ?? [seatOptions.min, seatOptions.max]}
            onValueChange={handleSeatsChange}
            min={seatOptions.min}
            max={seatOptions.max}
            step={seatOptions.step}
          />
          <RangeLabel
            min={filterParams.seats?.[0] ?? seatOptions.min}
            max={filterParams.seats?.[1] ?? seatOptions.max}
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
      </div>
    </div>
  )
}
