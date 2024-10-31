'use client'

import React from 'react'

import { cn } from '@/lib/utils/cn'
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
  totalPages: number
}> = (props) => {
  const [{ page: currentPage }, setCurrentPage] = useQueryStates(blogFiltersParsers)
  const { className, totalPages } = props
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1
  const hasExtraPrevPages = currentPage - 1 > 1
  const hasExtraNextPages = currentPage + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              onClick={() => {
                setCurrentPage({ page: currentPage - 1 })
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
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
