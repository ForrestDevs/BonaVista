import { useState } from 'react'
import { useFilterState } from './useFilterState'
import { FilterSection } from './filter-section'
import { PriceRange } from './price-range'
import { MobileFilterDialog } from './mobile-dialog'
import type { FilterConfig } from './filter'

export function FilterOptions({ filterConfig }: { filterConfig: FilterConfig }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { filters, setters, clearFilters } = useFilterState()

  const filterContent = (
    <div className="space-y-4">
      {filterConfig.enabledFilters.categories && (
        <FilterSection title="Categories">
          <></>
        </FilterSection>
      )}

      {filterConfig.enabledFilters.price && (
        <FilterSection title="Price">
          <PriceRange value={filters.priceRange} onChange={setters.setPriceRange} />
        </FilterSection>
      )}

      {/* Other filter sections */}
    </div>
  )

  return (
    <>
      {/* Mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <button type="button" className="text-gray-700" onClick={() => setMobileFiltersOpen(true)}>
          Filters
        </button>
      </div>
      <MobileFilterDialog open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        {filterContent}
      </MobileFilterDialog>

      {/* Desktop */}
      <div className="hidden lg:block">{filterContent}</div>
    </>
  )
}
