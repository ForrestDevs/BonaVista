'use client'

import React from 'react'

import { cn } from '@/lib/utils/cn'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { blogFiltersParsers } from '../searchParams'
import { useQueryStates } from 'nuqs'

export const Pagination: React.FC<{
  className?: string
  // page: number
  totalPages: number
}> = (props) => {
  const [{ page: currentPage }, setCurrentPage] = useQueryStates(blogFiltersParsers)

  // const router = useRouter()
  // const pathname = usePathname()
  // const searchParams = useSearchParams()

  const { className, totalPages } = props
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1
  const hasExtraPrevPages = currentPage - 1 > 1
  const hasExtraNextPages = currentPage + 1 < totalPages

  // const createPageUrl = (pageNumber: number) => {
  //   const params = new URLSearchParams(searchParams)
  //   params.set('page', pageNumber.toString())
  //   return `${pathname}?${params.toString()}`
  // }

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              onClick={() => {
                setCurrentPage({ page: currentPage - 1 })
                // router.push(createPageUrl(page - 1), { scroll: false })
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  setCurrentPage({ page: currentPage - 1 })
                  // router.push(createPageUrl(page - 1), { scroll: false })
                }}
              >
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              onClick={() => {
                setCurrentPage({ page: currentPage })
                // router.push(createPageUrl(page), { scroll: false })
              }}
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  setCurrentPage({ page: currentPage + 1 })
                  // router.push(createPageUrl(page + 1), { scroll: false })
                }}
              >
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              disabled={!hasNextPage}
              onClick={() => {
                setCurrentPage({ page: currentPage + 1 })
                // router.push(createPageUrl(page + 1), { scroll: false })
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
