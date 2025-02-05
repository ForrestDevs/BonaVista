'use client'

import { useState } from 'react'
import type { FilterConfig, FilterCriteria, FilterOption } from './types'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

interface FilterOptionsProps {
  config: FilterConfig
  criteria: FilterCriteria
  options: {
    categories?: FilterOption[]
    collections?: FilterOption[]
    brands?: FilterOption[]
    compatibility?: FilterOption[]
  }
  onUpdateFilter: (key: keyof FilterCriteria, value: any) => void
  onClearFilters: () => void
}

export function FilterOptions({
  config,
  criteria,
  options,
  onUpdateFilter,
  onClearFilters,
}: FilterOptionsProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filterSections = [
    config.enabledFilters.categories && {
      id: 'categories',
      name: 'Categories',
      options: options.categories || [],
      value: criteria.categories,
    },
    config.enabledFilters.collections && {
      id: 'collections',
      name: 'Collections',
      options: options.collections || [],
      value: criteria.collections,
    },
    config.enabledFilters.brands && {
      id: 'brands',
      name: 'Brands',
      options: options.brands || [],
      value: criteria.brands,
    },
    config.enabledFilters.compatibility && {
      id: 'compatibility',
      name: 'Compatibility',
      options: options.compatibility || [],
      value: criteria.compatibility,
    },
  ].filter(Boolean)

  const sortOptions = config.sortOptions?.map((option) => ({
    value: option,
    label:
      option === 'title'
        ? 'Name'
        : option === 'price'
          ? 'Price: Low to High'
          : option === '-price'
            ? 'Price: High to Low'
            : option === '-createdAt'
              ? 'Newest First'
              : option,
  }))

  const filterContent = (
    <form className="hidden lg:block">
      {/* Sort dropdown (desktop) */}
      {sortOptions && (
        <div className="mb-6">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={criteria.sort} onValueChange={(value) => onUpdateFilter('sort', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Price range (if enabled) */}
      {config.enabledFilters.price && (
        <div className="border-b border-gray-200 py-6">
          <h3 className="text-sm font-medium text-gray-900">Price</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-price" className="sr-only">
                Minimum Price
              </Label>
              <Input
                type="number"
                id="min-price"
                placeholder="Min"
                value={criteria.price_min || ''}
                onChange={(e) =>
                  onUpdateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="sr-only">
                Maximum Price
              </Label>
              <Input
                type="number"
                id="max-price"
                placeholder="Max"
                value={criteria.price_max || ''}
                onChange={(e) =>
                  onUpdateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter sections */}
      <Accordion type="multiple" defaultValue={filterSections.map((s) => s.id)}>
        {filterSections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger>{section.name}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {section.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${section.id}-${option.value}`}
                      checked={section.value?.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(section.value || []), option.value]
                          : (section.value || []).filter((v) => v !== option.value)
                        onUpdateFilter(section.id as keyof FilterCriteria, newValue)
                      }}
                    />
                    <Label
                      htmlFor={`filter-${section.id}-${option.value}`}
                      className="text-sm text-gray-600"
                    >
                      {option.label}
                      {option.count !== undefined && (
                        <span className="ml-1 text-gray-400">({option.count})</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </form>
  )

  return (
    <div className="w-full">
      {/* Mobile filter dialog */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          {/* Sort dropdown (mobile) */}
          {sortOptions && (
            <div className="py-6">
              <Label htmlFor="mobile-sort">Sort By</Label>
              <Select
                value={criteria.sort}
                onValueChange={(value) => onUpdateFilter('sort', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Filters */}
          <div className="mt-4 border-t border-gray-200">{filterContent}</div>
        </SheetContent>
      </Sheet>

      {/* Mobile filter button */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 pt-24 lg:hidden">
        <Button
          variant="outline"
          className="ml-4 sm:ml-6 lg:hidden"
          onClick={() => setMobileFiltersOpen(true)}
        >
          Filters
        </Button>
      </div>

      {/* Desktop filters */}
      <section aria-labelledby="filter-heading" className="pb-24 pt-6 w-full">
        <h2 id="filter-heading" className="sr-only">
          Product filters
        </h2>

        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="hidden lg:block">{filterContent}</div>

          {/* Active filters */}
          <div className="lg:col-span-3">
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(criteria).map(([key, value]) => {
                if (!value || key === 'sort' || key === 'search') return null
                if (Array.isArray(value) && !value.length) return null

                return Array.isArray(value) ? (
                  value.map((v) => (
                    <Button
                      key={`${key}-${v}`}
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const newValue = value.filter((val) => val !== v)
                        onUpdateFilter(key as keyof FilterCriteria, newValue)
                      }}
                    >
                      {v}
                      <X className="ml-1 h-4 w-4" />
                    </Button>
                  ))
                ) : (
                  <Button
                    key={key}
                    variant="secondary"
                    size="sm"
                    onClick={() => onUpdateFilter(key as keyof FilterCriteria, undefined)}
                  >
                    {`${key}: ${value}`}
                    <X className="ml-1 h-4 w-4" />
                  </Button>
                )
              })}
              {Object.values(criteria).some((v) => v && (!Array.isArray(v) || v.length > 0)) && (
                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
