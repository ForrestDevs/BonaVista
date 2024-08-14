// import { usePathname } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
import { CartSummaryNavInner } from '@/components/store/layout/nav/CartSummaryNav'
import { SearchNav } from '@/components/store/layout/nav/SearchNav'
import { NavMenu } from '@/components/store/layout/nav/NavMenu'
import { YnsLink } from '@/components/ui/link'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { useHeaderTheme } from '@/lib/providers/HeaderTheme'
import { User as UserIcon } from 'lucide-react'
export const Categories = [
  { name: 'Apparel', slug: 'apparel' },
  { name: 'Accessories', slug: 'accessories' },
]

export const Nav = () => {
  return (
    <div className="border-b py-4">
      <div className="sm:items-centerm mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-6 md:flex-nowrap lg:px-8">
        <YnsLink href="/">
          <h1 className="-mt-0.5 whitespace-nowrap text-xl font-bold">Your Next Store</h1>
        </YnsLink>

        <div className="sm:mr-auto">
          <NavMenu />
        </div>

        <div className="flex items-center justify-start gap-x-6"></div>
      </div>
    </div>
  )
}

export function StoreHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <YnsLink href="/" className="flex items-center space-x-2">
            <img src="/logo.webp" alt="BonaVista Leisurescapes" className="h-8 w-auto" />
          </YnsLink>

          <nav className="hidden md:flex gap-6">
            <YnsLink
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Products
            </YnsLink>
            <YnsLink
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </YnsLink>
            <YnsLink
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </YnsLink>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <SearchNav />

          <CartSummaryNavInner />

          <Button variant="ghost" size="icon" className="mr-6">
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">User Account</span>
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
