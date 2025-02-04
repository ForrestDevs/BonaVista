import React, { Suspense } from 'react'
import Link from 'next/link'
import { Logo } from '@components/payload/Logo'
import { YnsLink } from '@components/ui/link'
import { UserIcon } from 'lucide-react'
import { CartSummaryNav } from './cart/cart-summary-nav'
import { SearchBar } from './search-bar'
import { cn } from '@/lib/utils/cn'
import { RemoveScroll } from 'react-remove-scroll'

export async function ShopHeader() {
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

              <div className="hidden lg:flex lg:col-span-1 items-center justify-center"></div>

              <div className="lg:col-span-1 flex items-center justify-end gap-2 lg:gap-4 min-w-0">
                <Suspense fallback={<div>Loading...</div>}>
                  <SearchBar />
                </Suspense>
                <CartSummaryNav />
                <YnsLink href="/shop/account" className="">
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">User Account</span>
                </YnsLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
