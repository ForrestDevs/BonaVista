'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonShopHome() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="grow">
        <div className="space-y-24 py-12">
          {/* Hero Carousel Skeleton */}
          <div className="container mx-auto px-4">
            <Skeleton className="w-full h-[400px] rounded-xl" />
          </div>

          {/* Featured Products Skeleton */}
          <section className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-white">
                  <CardContent className="p-4">
                    <Skeleton className="w-full h-48 mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Categories Skeleton */}
          <section className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mx-auto mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-white">
                  <CardContent className="p-4">
                    <Skeleton className="w-full h-40 mb-4" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Newsletter Skeleton */}
          <section className="bg-[#1e365c]">
            <div className="container mx-auto px-4 py-16">
              <Skeleton className="h-8 w-96 mx-auto mb-4 bg-white/20" />
              <Skeleton className="h-6 w-[600px] mx-auto mb-8 bg-white/20" />
              <div className="flex justify-center gap-4">
                <Skeleton className="h-10 w-64 bg-white/20" />
                <Skeleton className="h-10 w-24 bg-white/20" />
              </div>
            </div>
          </section>

          {/* Reviews Skeleton */}
          <section className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-white">
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full mb-4" />
                    <Skeleton className="h-6 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
