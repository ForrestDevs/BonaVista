import React, { Suspense } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { UserIcon } from 'lucide-react'
import { CartSummaryNav } from './cart/cart-summary-nav'
import { SearchBar, SearchFallback } from './search-bar'
import { cn } from '@/lib/utils/cn'
import { RemoveScroll } from 'react-remove-scroll'
import { ShopDesktopNav } from './desktop-nav'
import { MobileNav } from './mobile-nav'
import { OptimizedLink } from '@/components/payload/Link/optimized-link'

export async function ShopHeader() {
  return (
    <header className="h-[var(--shop-header-height)]">
      <div className="fixed top-0 left-0 right-0 z-50 shadow-xs min-w-[320px] select-none h-[var(--shop-header-height)]">
        <div
          className={cn(
            RemoveScroll.classNames.fullWidth,
            'h-[var(--shop-header-height)] absolute top-0 left-0 right-0 border-b border-gray-200 bg-background',
          )}
        >
          <div className="container flex flex-col justify-center h-full">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-4">
              <div className="flex items-center justify-start min-w-0">
                <Link href="/" className="relative">
                  <Logo className="h-[40px] sm:h-[45px] md:h-[50px] lg:h-[55px]" />
                </Link>
              </div>

              <div className="hidden lg:flex items-center justify-center">
                <ShopDesktopNav />
              </div>

              <div className="lg:col-span-1 flex items-center justify-end gap-1 sm:gap-1.5 md:gap-2 lg:gap-4 min-w-0">
                <Suspense fallback={<SearchFallback />}>
                  <SearchBar />
                </Suspense>
                <CartSummaryNav />
                <OptimizedLink
                  href="/shop/account"
                  className="hidden lg:flex relative items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">User Account</span>
                </OptimizedLink>
                <MobileNav />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
