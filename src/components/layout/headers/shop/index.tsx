import React, { Suspense } from 'react'
import Link from 'next/link'
import { Logo } from '@components/payload/Logo'
import { YnsLink } from '@components/ui/link'
import { UserIcon } from 'lucide-react'
import { CartSummaryNav } from './cart/cart-summary-nav'
import { SearchBar } from './search-bar'
import { cn } from '@/lib/utils/cn'
import { RemoveScroll } from 'react-remove-scroll'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import MobileNav from '../site/mobile-nav'
import { ShopDesktopNav } from './desktop-nav'
import { cache } from '@/lib/utils/cache'
import { BasePayload } from 'payload'
import getPayload from '@/lib/utils/getPayload'
import { PRODUCT_CATEGORY_SLUG } from '@/payload/collections/constants'

// async function getCachedCategories(payload: BasePayload) {
//   const cachedFn = cache(async () => {
//     const categories = await payload.find({
//       collection: PRODUCT_CATEGORY_SLUG,
//     })
//     return categories
//   }, ['shop-categories'])

//   return cachedFn()
// }

export async function ShopHeader() {
  // const payload = await getPayload()
  // const categories = await getCachedCategories(payload)

  return (
    <header className="h-[var(--shop-header-height)]">
      <div className="fixed top-0 left-0 right-0 z-50 shadow-sm min-w-[320px] select-none h-[var(--shop-header-height)]">
        <div
          className={cn(
            RemoveScroll.classNames.fullWidth,
            'h-[var(--shop-header-height)] absolute top-0 left-0 right-0 border-b border-gray-200 bg-background',
          )}
        >
          <div className="container flex flex-col justify-center h-full">
            <div className="grid grid-cols-2 lg:grid-cols-3 items-center gap-2 md:gap-4">
              <div className="col-span-1 flex items-center justify-start min-w-0">
                <Link href="/" className="relative">
                  <Logo />
                </Link>
              </div>

              <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                <ShopDesktopNav />
                {/* <nav className="flex items-center">
                  <YnsLink
                    href="/shop/products"
                    className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors duration-200 text-center whitespace-nowrap"
                  >
                    All Products
                  </YnsLink>
                  <YnsLink
                    href="/shop/category/water-care"
                    className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors duration-200 text-center whitespace-nowrap"
                  >
                    Water Care
                  </YnsLink>
                  <YnsLink
                    href="/shop/category/accessories"
                    className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors duration-200 text-center whitespace-nowrap"
                  >
                    Accessories
                  </YnsLink>
                  <YnsLink
                    href="/shop/category/outdoor-living"
                    className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors duration-200 text-center whitespace-nowrap"
                  >
                    Outdoor Living
                  </YnsLink>
                  <YnsLink
                    href="/shop/collection/sale"
                    className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200 text-center whitespace-nowrap"
                  >
                    Sale
                  </YnsLink>
                </nav> */}
              </div>

              <div className="lg:col-span-1 flex items-center justify-end gap-2 lg:gap-4 min-w-0">
                <SearchBar />
                <CartSummaryNav />
                <YnsLink href="/shop/account" className="">
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">User Account</span>
                </YnsLink>
                {/* <MobileNav header={header} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
