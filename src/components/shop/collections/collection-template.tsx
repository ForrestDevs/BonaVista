import { Suspense } from 'react'
import { ShopCollection } from '@payload-types'
import SkeletonProductGrid from '@components/shop/skeletons/layout/skeleton-product-grid'
import { SortOptions } from '../lists/refinement-list/sort-products'
// import PaginatedProducts from '../lists/pagination/paginated-products'

// import RefinementList from '@modules/store/components/refinement-list'
// import { SortOptions } from '@modules/store/components/refinement-list/sort-products'
// import PaginatedProducts from '@modules/store/templates/paginated-products'

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
}: {
  sortBy?: SortOptions
  collection: ShopCollection
  page?: string
}) {
  const pageNumber = page ? parseInt(page) : 1

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      {/* <RefinementList sortBy={sortBy || 'created_at'} /> */}
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{collection.title}</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          {/* <PaginatedProducts
            sortBy={sortBy || 'created_at'}
            page={pageNumber}
            collectionId={collection.id}
          /> */}
        </Suspense>
      </div>
    </div>
  )
}
