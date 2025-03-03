import { getCategoryTree } from '@/lib/actions/categories'
import { getCachedCollections } from '@/lib/utils/getCategories'
import { MobileNavClient } from './mobile-nav-client'

export async function MobileNav() {
  // Prefetch the data that will later be used by the client component
  // This improves initial load performance by hydrating server-fetched data
  const { rootCategories, categoryMap } = await getCategoryTree()
  const collections = await getCachedCollections()

  return (
    <MobileNavClient
      rootCategories={rootCategories}
      categoryMap={categoryMap}
      collections={collections}
    />
  )
}
