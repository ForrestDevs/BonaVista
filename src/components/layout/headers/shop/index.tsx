import React, { Suspense } from 'react'
import { getCachedGlobal } from '@lib/utils/getGlobals'
import Link from 'next/link'
import { Logo } from '@components/payload/Logo'
import { ShopHeaderNav } from '@components/layout/headers/shop/Nav'
import { YnsLink } from '@components/ui/link'
import { MenuIcon, ShoppingCartIcon, UserIcon } from 'lucide-react'
import { Button } from '@components/ui/button'
import { SearchBar } from '@components/layout/headers/shop/Search/search-bar'
import { CartToggle } from '@components/layout/headers/shop/cart-toggle'
import Search, { SearchSkeleton } from '@components/layout/headers/shop/search'
import Spinner from '@components/ui/spinner'

export async function ShopHeader() {
  const header = await getCachedGlobal<'header'>('header', 1)

  if (!header) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-wrap items-center justify-between h-auto sm:h-16 py-4 sm:py-0">
        <div className="flex items-center w-1/3 sm:w-auto">
          <ShopHeaderNav header={header} />
          <YnsLink href="/" className="flex items-center space-x-2 ml-2">
            <Logo />
          </YnsLink>
        </div>

        <div className="order-3 sm:order-2 w-full sm:w-1/2 mt-4 sm:mt-0">
          <SearchBar />
          {/* <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense> */}
        </div>

        <div className="flex items-center justify-center order-2 sm:order-3">
          <YnsLink href="/shop/account" className="mr-4">
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">User Account</span>
          </YnsLink>
          <Suspense
            fallback={
              <div className="relative mr-2.5 block h-6 w-6">
                <ShoppingCartIcon className="h-5 w-5" />
              </div>
            }
          >
            <CartToggle />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
