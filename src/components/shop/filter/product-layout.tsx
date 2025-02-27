import React, { Suspense } from 'react'
import ProductList from './product-list'
import { ProductFilters } from './product-filters'
import { FilterConfig } from './types'
import { Skeleton } from '@/components/ui/skeleton'

// Skeleton loader for product list during suspense
function ProductListSkeleton() {
  return (
    <div className="w-full min-h-[500px] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          ))}
      </div>
    </div>
  )
}

export default function ProductLayout({ config }: { config: FilterConfig }) {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
        {/* Filters - left side on desktop, hidden on mobile */}
        <aside className="md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-2rem)] md:mb-20">
          <ProductFilters config={config} />
        </aside>

        {/* Product listing - right side on desktop */}
        <main>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList config={config} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
