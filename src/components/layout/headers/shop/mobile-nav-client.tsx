'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Menu as MenuIcon } from 'lucide-react'
import { OptimizedLink } from '@/components/payload/Link/optimized-link'
import { ShoppingBagIcon } from '@/components/icons/shopping-bag'

interface MobileNavClientProps {
  rootCategories: any[]
  categoryMap: Record<string, any>
  collections: any[]
}

export function MobileNavClient({
  rootCategories,
  categoryMap,
  collections,
}: MobileNavClientProps) {
  const [open, setOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden relative flex items-center justify-center min-w-10 min-h-10 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Open Mobile Navigation Menu"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetTitle className="sr-only">Mobile Shop Navigation</SheetTitle>
      <SheetContent
        side="right"
        className="flex flex-col w-full max-w-md p-0 border-l border-gray-100 shadow-lg"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Shop Online</h2>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="py-2 px-4">
              {/* All Products Link */}
              <Link
                href="/shop/products"
                className="flex items-center py-3 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                All Products
              </Link>
            </div>

            {/* Categories Section */}
            <div className="py-2 px-4 border-t border-gray-100">
              <h3 className="text-sm font-medium uppercase text-gray-500 mb-2 tracking-wide">
                Categories
              </h3>
              <div className="space-y-1">
                {rootCategories.map((category) => (
                  <div key={category.id} className="py-1">
                    <Collapsible
                      open={expandedCategories[category.id]}
                      onOpenChange={() => toggleCategory(category.id)}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {category.title}
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 text-gray-400 transition-transform duration-200',
                            expandedCategories[category.id] && 'rotate-90',
                          )}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-1 pt-1 pb-2">
                        <Link
                          href={`/shop/category/${category.slug}`}
                          className="block py-2 text-sm font-medium text-blue-600"
                          onClick={() => setOpen(false)}
                        >
                          View All {category.title}
                        </Link>
                        {categoryMap[category.id]?.children?.map((subCategory: any) => (
                          <div key={subCategory.id} className="py-1">
                            {categoryMap[subCategory.id]?.children?.length > 0 ? (
                              <Collapsible
                                open={expandedCategories[subCategory.id]}
                                onOpenChange={() => toggleCategory(subCategory.id)}
                              >
                                <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-sm text-gray-800 hover:text-blue-600 transition-colors">
                                  {subCategory.title}
                                  <ChevronRight
                                    className={cn(
                                      'h-3 w-3 text-gray-400 transition-transform duration-200',
                                      expandedCategories[subCategory.id] && 'rotate-90',
                                    )}
                                  />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-3 space-y-1 pt-1 pb-1">
                                  <Link
                                    href={`/shop/category/${subCategory.slug}`}
                                    className="block py-1 text-xs font-medium text-blue-600"
                                    onClick={() => setOpen(false)}
                                  >
                                    View All {subCategory.title}
                                  </Link>
                                  {categoryMap[subCategory.id]?.children?.map(
                                    (thirdLevelCategory: any) => (
                                      <Link
                                        key={thirdLevelCategory.id}
                                        href={`/shop/category/${thirdLevelCategory.slug}`}
                                        className="block py-1 text-xs text-gray-700 hover:text-blue-600 transition-colors"
                                        onClick={() => setOpen(false)}
                                      >
                                        {thirdLevelCategory.title}
                                      </Link>
                                    ),
                                  )}
                                </CollapsibleContent>
                              </Collapsible>
                            ) : (
                              <Link
                                href={`/shop/category/${subCategory.slug}`}
                                className="block py-1 text-sm text-gray-800 hover:text-blue-600 transition-colors"
                                onClick={() => setOpen(false)}
                              >
                                {subCategory.title}
                              </Link>
                            )}
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </div>

            {/* Collections Section */}
            <div className="py-2 px-4 border-t border-gray-100">
              <h3 className="text-sm font-medium uppercase text-gray-500 mb-2 tracking-wide">
                Collections
              </h3>
              <div className="space-y-1">
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/shop/collection/${collection.slug}`}
                    className="block py-2 text-base text-gray-900 hover:text-blue-600 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="border-t border-gray-100 py-4 px-4 bg-gray-50">
            <div className="flex flex-col space-y-2">
              <OptimizedLink
                href="/shop/account"
                className="flex items-center py-2 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                <UserIcon className="h-5 w-5 mr-2" />
                <span>My Account</span>
              </OptimizedLink>
              <OptimizedLink
                href="/shop/orders"
                className="flex items-center py-2 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                <span>My Orders</span>
              </OptimizedLink>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
