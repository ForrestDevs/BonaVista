'use client'

import React, { useTransition } from 'react'
import { FilterConfig } from './types'
import { Button } from '@/components/ui/button'
import { useFilterState } from './useFilterState'
import { ArrowUpDown, Check, ChevronDown, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils/cn'

// Helper function to display sort option labels
const getSortOptionLabel = (option: string): string => {
  if (option === 'title') return 'Alphabetical: A-Z'
  if (option === 'priceMin') return 'Price: Low to High'
  if (option === '-priceMax') return 'Price: High to Low'
  if (option === '-createdAt') return 'Newest First'
  return option
}

export default function ProductSort({ config }: { config: FilterConfig }) {
  const [isPending, startTransition] = useTransition()
  const { criteria, setters } = useFilterState(startTransition)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 border-dashed min-w-[140px] justify-between"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Sorting...</span>
            </div>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Sort by</span>
              </span>
              <span className="font-medium text-xs">{getSortOptionLabel(criteria.sort)}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {config.sortOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => setters.setSort(option)}
            className={cn(
              'flex items-center justify-between',
              criteria.sort === option && 'font-medium',
            )}
          >
            <span>{getSortOptionLabel(option)}</span>
            {criteria.sort === option && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
