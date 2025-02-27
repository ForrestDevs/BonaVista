'use client'

import { Fragment, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Filter, Loader2, Search, PlusCircle, MinusCircle } from 'lucide-react'
import type { FilterCriteria, FilterConfig, FilterOption } from './types'
import { useFilterState } from './useFilterState'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/cn'

export function ProductFilters({ config }: { config: FilterConfig }) {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { criteria, setters, clearFilters } = useFilterState(startTransition)
  const [priceMin, setPriceMin] = useState<string>(criteria.price_min?.toString() || '')
  const [priceMax, setPriceMax] = useState<string>(criteria.price_max?.toString() || '')
  const [categorySearch, setCategorySearch] = useState('')
  const [brandSearch, setBrandSearch] = useState('')

  // Apply price filter
  const handleApplyPriceFilter = () => {
    setters.setPriceMin(priceMin ? Number(priceMin) : null)
    setters.setPriceMax(priceMax ? Number(priceMax) : null)
  }

  // Handle checkbox change
  const handleCheckboxChange = (key: keyof FilterCriteria, value: string, checked: boolean) => {
    const currentValues = [...((criteria[key] as string[]) || [])]
    if (checked) {
      setters[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`]([...currentValues, value])
    } else {
      setters[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`](
        currentValues.filter((v) => v !== value),
      )
    }
  }

  // Check if a filter value is selected
  const isSelected = (key: keyof FilterCriteria, value: string) => {
    const values = (criteria[key] as string[]) || []
    return values.includes(value)
  }

  // Count active filters
  const activeFilterCount =
    [
      ...(criteria.categories || []),
      ...(criteria.collections || []),
      ...(criteria.brands || []),
      ...(criteria.compatibility || []),
    ].length + (criteria.price_min || criteria.price_max ? 1 : 0)

  // Filter categories based on search
  const filteredCategories =
    config.options.categories?.filter((cat) =>
      cat.label.toLowerCase().includes(categorySearch.toLowerCase()),
    ) || []

  // Filter brands based on search
  const filteredBrands =
    config.options.brands?.filter((brand) =>
      brand.label.toLowerCase().includes(brandSearch.toLowerCase()),
    ) || []

  // Active filters for display
  const activeFilters = [
    ...(criteria.categories || []).map((slug) => {
      const option = config.options.categories?.find((o) => o.value === slug)
      return option ? { type: 'Category', label: option.label, value: slug } : null
    }),
    ...(criteria.collections || []).map((slug) => {
      const option = config.options.collections?.find((o) => o.value === slug)
      return option ? { type: 'Collection', label: option.label, value: slug } : null
    }),
    ...(criteria.brands || []).map((slug) => {
      const option = config.options.brands?.find((o) => o.value === slug)
      return option ? { type: 'Brand', label: option.label, value: slug } : null
    }),
    ...(criteria.compatibility || []).map((slug) => {
      const option = config.options.compatibility?.find((o) => o.value === slug)
      return option ? { type: 'Compatibility', label: option.label, value: slug } : null
    }),
    criteria.price_min || criteria.price_max
      ? {
          type: 'Price',
          label: `${criteria.price_min ? '$' + criteria.price_min : ''}${
            criteria.price_min && criteria.price_max ? ' - ' : ''
          }${criteria.price_max ? '$' + criteria.price_max : ''}`,
          value: 'price',
        }
      : null,
  ].filter(Boolean)

  // Remove a specific filter
  const removeFilter = (type: string, value: string) => {
    if (type === 'Category') {
      handleCheckboxChange('categories', value, false)
    } else if (type === 'Collection') {
      handleCheckboxChange('collections', value, false)
    } else if (type === 'Brand') {
      handleCheckboxChange('brands', value, false)
    } else if (type === 'Compatibility') {
      handleCheckboxChange('compatibility', value, false)
    } else if (type === 'Price') {
      setters.setPriceMin(null)
      setters.setPriceMax(null)
      setPriceMin('')
      setPriceMax('')
    }
  }

  // Filter section component to reduce duplication
  const FilterSection = ({
    title,
    count,
    children,
  }: {
    title: string
    count?: number
    children: React.ReactNode
  }) => (
    <div className="py-4 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="text-xs font-normal">
            {count}
          </Badge>
        )}
      </div>
      {children}
    </div>
  )

  // Option item component for checkbox filters
  const OptionItem = ({
    option,
    filterKey,
    id,
  }: {
    option: FilterOption
    filterKey: keyof FilterCriteria
    id: string
  }) => (
    <div className="flex items-center gap-2 py-1.5">
      <Checkbox
        id={id}
        checked={isSelected(filterKey, option.value)}
        onCheckedChange={(checked) =>
          handleCheckboxChange(filterKey, option.value, checked === true)
        }
        disabled={isPending}
        className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
      <label
        htmlFor={id}
        className="flex-1 text-sm cursor-pointer flex items-center justify-between"
      >
        <span>{option.label}</span>
        {option.count !== undefined && (
          <span className="text-xs text-muted-foreground ml-1">({option.count})</span>
        )}
      </label>
    </div>
  )

  const FilterAccordionItem = ({
    title,
    badge,
    children,
  }: {
    title: string
    badge?: React.ReactNode
    children: React.ReactNode
  }) => (
    <div className="p-4">
      <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')} className="border-0">
        <AccordionTrigger className="py-0">
          <span className="text-sm font-medium">{title}</span>
          {badge && badge}
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <div className="my-3">{children}</div>
        </AccordionContent>
      </AccordionItem>
    </div>
  )

  const FilterAccordionContent = () => (
    <div className="divide-y divide-border">
      {config.enabledFilters.categories && filteredCategories.length > 0 && (
        <FilterAccordionItem
          title="Categories"
          badge={
            criteria.categories &&
            criteria.categories.length > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs rounded-full px-2 py-0">
                {criteria.categories.length}
              </Badge>
            )
          }
        >
          <div className="my-3 px-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search categories"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-8 h-8 text-sm"
                disabled={isPending}
              />
            </div>
          </div>
          <ScrollArea className="h-[225px] pr-4">
            <div className="space-y-0.5">
              {filteredCategories.map((option) => (
                <OptionItem
                  key={option.value}
                  option={option}
                  filterKey="categories"
                  id={`desktop-category-${option.value}`}
                />
              ))}
            </div>
          </ScrollArea>
        </FilterAccordionItem>
      )}
      {config.enabledFilters.collections &&
        config.options.collections &&
        config.options.collections.length > 0 && (
          <FilterAccordionItem
            title="Collections"
            badge={
              criteria.collections &&
              criteria.collections.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs rounded-full px-2 py-0">
                  {criteria.collections.length}
                </Badge>
              )
            }
          >
            <div className="space-y-0.5">
              {config.options.collections.map((option) => (
                <OptionItem
                  key={option.value}
                  option={option}
                  filterKey="collections"
                  id={`desktop-collection-${option.value}`}
                />
              ))}
            </div>
          </FilterAccordionItem>
        )}
      {config.enabledFilters.brands && filteredBrands.length > 0 && (
        <FilterAccordionItem
          title="Brands"
          badge={
            criteria.brands &&
            criteria.brands.length > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs rounded-full px-2 py-0">
                {criteria.brands.length}
              </Badge>
            )
          }
        >
          <div className="my-3 px-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search brands"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
                disabled={isPending}
              />
            </div>
          </div>
          <ScrollArea className="h-[225px] pr-4">
            <div className="space-y-0.5">
              {filteredBrands.map((option) => (
                <OptionItem
                  key={option.value}
                  option={option}
                  filterKey="brands"
                  id={`desktop-brand-${option.value}`}
                />
              ))}
            </div>
          </ScrollArea>
        </FilterAccordionItem>
      )}
      {config.enabledFilters.compatibility &&
        config.options.compatibility &&
        config.options.compatibility.length > 0 && (
          <FilterAccordionItem
            title="Compatibility"
            badge={
              criteria.compatibility &&
              criteria.compatibility.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs rounded-full px-2 py-0">
                  {criteria.compatibility.length}
                </Badge>
              )
            }
          >
            <div className="space-y-0.5">
              {config.options.compatibility.map((option) => (
                <OptionItem
                  key={option.value}
                  option={option}
                  filterKey="compatibility"
                  id={`desktop-compatibility-${option.value}`}
                />
              ))}
            </div>
          </FilterAccordionItem>
        )}
      {config.enabledFilters.price && (
        <FilterAccordionItem
          title="Price Range"
          badge={
            (criteria.price_min || criteria.price_max) && (
              <Badge variant="secondary" className="ml-auto text-xs rounded-full px-2 py-0">
                1
              </Badge>
            )
          }
        >
          <div className="space-y-3">
            <div className="grid gap-2">
              <div className="grid gap-2">
                <label htmlFor="desktop-price-min" className="text-xs text-muted-foreground">
                  Min Price
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-0 flex h-full items-center text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="desktop-price-min"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Min"
                    className="pl-5 h-8"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="desktop-price-max" className="text-xs text-muted-foreground">
                  Max Price
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-0 flex h-full items-center text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="desktop-price-max"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Max"
                    className="pl-5 h-8"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={handleApplyPriceFilter}
              size="sm"
              variant="secondary"
              className="w-full mt-1"
              disabled={isPending}
            >
              Apply
            </Button>
          </div>
        </FilterAccordionItem>
      )}
    </div>
  )

  return (
    <div>
      <div className="md:hidden mb-4">
        <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-between gap-2"
              disabled={isPending}
            >
              <span className="flex items-center gap-2">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
                <span>Filters</span>
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-lg flex flex-col">
            <SheetHeader className="mb-2">
              <SheetTitle>Refine Results</SheetTitle>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  size="sm"
                  className="absolute right-12 top-4"
                  disabled={isPending}
                >
                  Clear all
                </Button>
              )}
            </SheetHeader>

            <ScrollArea className="flex-1">
              <Accordion
                type="multiple"
                defaultValue={['categories', 'collections', 'brands', 'compatibility', 'price']}
                className="w-full"
              >
                <FilterAccordionContent />
              </Accordion>
            </ScrollArea>

            <SheetFooter className="pt-4 border-t border-border mt-auto">
              <SheetClose asChild>
                <Button size="sm" className="w-full" disabled={isPending}>
                  View Results
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {activeFilterCount > 0 && (
        <div className="bg-card rounded-md border mb-6">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Active Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 py-0 text-xs hover:bg-secondary"
                disabled={isPending}
              >
                Clear all
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {activeFilters.map(
                (filter) =>
                  filter && (
                    <Badge
                      key={`${filter.type}-${filter.value}`}
                      variant="secondary"
                      className="flex items-center gap-1 pl-2 py-1.5"
                    >
                      <span className="text-xs">{filter.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => filter && removeFilter(filter.type, filter.value)}
                        className="h-5 w-5 p-0 ml-1 rounded-full hover:bg-secondary-foreground/20"
                        disabled={isPending}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {filter.label} filter</span>
                      </Button>
                    </Badge>
                  ),
              )}
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block">
        <div className="bg-card rounded-md border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-medium">Filters</h2>
            {isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="animate-spin h-3 w-3" />
                <span className="text-xs">Updating</span>
              </div>
            )}
          </div>
          <Accordion type="single" collapsible defaultValue="categories" className="w-full">
            <FilterAccordionContent />
          </Accordion>
        </div>
      </div>
    </div>
  )
}
