import * as React from 'react'
import { Header } from '@payload-types'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuSub,
  Trigger,
  SingleLink,
  mainDropdownClass,
  collectionsDropdownClass,
} from '@/components/custom/shop-nav'
import { getCachedCollections } from '@/lib/utils/getCategories'
import { cn } from '@/lib/utils/cn'
import { getCategoryTree } from '@/lib/actions/categories'
import { CategoryPanels } from './category-panels'

export const ShopDesktopNav = async ({ className }: { className?: string }) => {
  const collections = await getCachedCollections()
  const { rootCategories, categoryMap } = await getCategoryTree()

  const featuredCollections = collections.slice(0, 2)

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="flex flex-1 list-none items-center justify-center space-x-5 lg:space-x-6">
        {/* All Products Link */}
        <NavigationMenuItem className="flex-none">
          <SingleLink
            href="/shop/products"
            title="All Products"
            variant="lg"
            className="hover:underline underline-offset-4"
          />
        </NavigationMenuItem>

        {/* Categories Dropdown */}
        <NavigationMenuItem className="relative">
          <Trigger className="text-lg">Categories</Trigger>
          <NavigationMenuContent className={cn(mainDropdownClass(), 'category-nav-content')}>
            <NavigationMenuSub>
              <CategoryPanels rootCategories={rootCategories} initialCategoryMap={categoryMap} />
            </NavigationMenuSub>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Collections Dropdown */}
        <NavigationMenuItem className="relative">
          <Trigger className="text-lg">Collections</Trigger>
          <NavigationMenuContent className={collectionsDropdownClass()}>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium text-gray-500">Featured Collections</h3>
              <div className="grid grid-cols-1 gap-6">
                {featuredCollections.map((collection) => (
                  <SingleLink
                    key={collection.id}
                    href={`/shop/collections/${collection.slug}`}
                    title={collection.title}
                    variant="lg"
                    className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                    description="Explore our latest selection"
                  />
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
