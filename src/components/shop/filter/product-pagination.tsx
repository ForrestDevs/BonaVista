'use client'

import React, { useTransition } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useFilterState } from './useFilterState'
import { cn } from '@/lib/utils/cn'
import { LIMIT_OPTIONS } from './product-browse-params'

interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  totalProducts: number
}

export default function ProductPagination({
  currentPage,
  totalPages,
  totalProducts,
}: ProductPaginationProps) {
  const [isPending, startTransition] = useTransition()
  const { setters, criteria } = useFilterState(startTransition)

  // Calculate product count display values
  const itemsPerPage = criteria.limit || 12
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage)

  const handlePageSizeChange = (value: string) => {
    setters.setPageSize(Number(value))
    setters.setPage(1)
  }

  const handlePageChange = (page: number) => {
    startTransition(() => {
      setters.setPage(page)

      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    })
  }

  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-8 border-t border-border pt-8">
      <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{startItem}</span> to{' '}
          <span className="font-medium text-foreground">{endItem}</span> of{' '}
          <span className="font-medium text-foreground">{totalProducts}</span> products
        </p>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Show</p>
          <Select
            value={criteria.limit?.toString()}
            onValueChange={handlePageSizeChange}
            disabled={isPending}
          >
            <SelectTrigger className="h-8 w-[80px]" aria-label="Select number of items per page">
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <SelectValue placeholder="12" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Products per page</SelectLabel>
                {LIMIT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">per page</p>
        </div>
      </div>

      <Pagination className="mx-auto">
        <PaginationContent className="flex-wrap">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(criteria.page - 1)}
              disabled={criteria.page === 1 || isPending}
              aria-label="Go to previous page"
              className={cn('border border-border', isPending && 'opacity-50 cursor-not-allowed')}
            />
          </PaginationItem>

          <PaginationItems
            criteria={criteria}
            setters={setters}
            isPending={isPending}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(criteria.page + 1)}
              disabled={criteria.page === totalPages || isPending}
              aria-label="Go to next page"
              className={cn('border border-border', isPending && 'opacity-50 cursor-not-allowed')}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function PaginationItems({
  criteria,
  setters,
  isPending,
  totalPages,
  handlePageChange,
}: {
  criteria: ReturnType<typeof useFilterState>['criteria']
  setters: ReturnType<typeof useFilterState>['setters']
  isPending: boolean
  totalPages: number
  handlePageChange: (page: number) => void
}) {
  // Logic to show sensible pagination controls based on total pages
  const items: React.ReactNode[] = []

  // Current page for better readability
  const currentPage = criteria.page || 1

  // Always show first page
  items.push(
    <PaginationItem key="page-1">
      <PaginationLink
        isActive={currentPage === 1}
        onClick={() => handlePageChange(1)}
        disabled={isPending}
        className={cn(
          'border border-border',
          currentPage === 1 && 'border-primary',
          isPending && 'opacity-50 cursor-not-allowed',
        )}
      >
        {isPending && currentPage === 1 ? <Loader2 className="h-3 w-3 animate-spin" /> : 1}
      </PaginationLink>
    </PaginationItem>,
  )

  // Calculate range of visible pages
  let startPage = Math.max(2, currentPage - 1)
  let endPage = Math.min(totalPages - 1, currentPage + 1)

  // Adjust to ensure we show up to 3 pages (plus first/last)
  if (startPage > 2) {
    items.push(
      <PaginationItem key="ellipsis-start">
        <PaginationEllipsis />
      </PaginationItem>,
    )
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    items.push(
      <PaginationItem key={`page-${i}`}>
        <PaginationLink
          isActive={currentPage === i}
          onClick={() => handlePageChange(i)}
          disabled={isPending}
          className={cn(
            'border border-border',
            currentPage === i && 'border-primary',
            isPending && 'opacity-50 cursor-not-allowed',
          )}
        >
          {isPending && currentPage === i ? <Loader2 className="h-3 w-3 animate-spin" /> : i}
        </PaginationLink>
      </PaginationItem>,
    )
  }

  // Add ending ellipsis if needed
  if (endPage < totalPages - 1) {
    items.push(
      <PaginationItem key="ellipsis-end">
        <PaginationEllipsis />
      </PaginationItem>,
    )
  }

  // Always show last page if more than 1 page
  if (totalPages > 1) {
    items.push(
      <PaginationItem key={`page-${totalPages}`}>
        <PaginationLink
          isActive={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={isPending}
          className={cn(
            'border border-border',
            currentPage === totalPages && 'border-primary',
            isPending && 'opacity-50 cursor-not-allowed',
          )}
        >
          {isPending && currentPage === totalPages ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            totalPages
          )}
        </PaginationLink>
      </PaginationItem>,
    )
  }

  return items
}
