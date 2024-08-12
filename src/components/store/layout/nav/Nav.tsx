

// import { usePathname } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
import { CartSummaryNavInner } from '@/components/store/layout/nav/CartSummaryNav'
import { SearchNav } from '@/components/store/layout/nav/SearchNav'
import { NavMenu } from '@/components/store/layout/nav/NavMenu'
import { YnsLink } from '@/components/ui/link'
// import { useHeaderTheme } from '@/lib/providers/HeaderTheme'

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

        <div className="flex items-center justify-start gap-x-6">
          <SearchNav />
          <CartSummaryNavInner />
        </div>
      </div>
    </div>
  )
}
