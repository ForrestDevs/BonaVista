'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingGallery() {
  return (
    <div className="flex flex-col min-h-screen space-y-10">
      {/* Hero Skeleton */}
      <section className="relative w-full h-[60vh] bg-gray-100">
        <div className="container h-full flex flex-col justify-center items-center gap-6">
          <Skeleton className="h-8 w-48 bg-gray-200" />
          <Skeleton className="h-16 w-96 bg-gray-200" />
          <Skeleton className="h-12 w-72 bg-gray-200" />
        </div>
      </section>

      {/* Filter Skeletons */}
      <section className="container">
        <div className="hidden md:flex flex-wrap justify-center gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-[200px] bg-gray-200" />
          ))}
        </div>

        <div className="md:hidden">
          <Skeleton className="h-10 w-full bg-gray-200" />
        </div>
      </section>

      {/* Gallery Grid Skeleton */}
      <section className="container flex flex-col justify-center gap-10 py-10">
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="col-span-4">
              <Skeleton className="aspect-square w-full bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-[72px] w-[200px] bg-gray-200" />
        </div>
      </section>
    </div>
  )
}
