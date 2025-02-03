import React, { Suspense } from 'react'
import Link from 'next/link'
import { Logo } from '@components/payload/Logo'
import { YnsLink } from '@components/ui/link'
import { UserIcon } from 'lucide-react'
import { CartSummaryNav } from './cart/cart-summary-nav'
import { SearchBar } from './search-bar'

export async function ShopHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="h-[84.5px] container flex items-center px-4 md:px-6">
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 items-center gap-2 md:gap-4">
          {/* Left section - Logo */}
          <div className="col-span-1 flex items-center justify-start">
            <Link href="/" className="relative">
              <Logo />
            </Link>
          </div>

          {/* Center section - Nav (hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
            {/* <DesktopNav header={header} className="col-span-1" /> */}
          </div>

          {/* Right section - Search, Cart, Account */}
          <div className="lg:col-span-1 flex items-center justify-end gap-2 lg:gap-4">
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
    </header>
  )
}
