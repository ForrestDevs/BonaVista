import React from 'react'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import Link from 'next/link'
import MobileNav from './mobile-nav'
import { DesktopNav } from './desktop-nav'
import { Logo } from '@/components/payload/Logo'
import { RemoveScroll } from 'react-remove-scroll'
import { cn } from '@/lib/utils/cn'

export default async function MarketingHeader() {
  const header = await getCachedGlobal<'header'>('header')

  if (!header) return null

  return (
    <header className="h-[var(--marketing-header-height)]">
      <div className="fixed top-0 left-0 right-0 z-50 shadow-sm min-w-[320px] select-none h-[var(--shop-header-height)]">
        <div
          className={cn(
            RemoveScroll.classNames.fullWidth,
            'h-[var(--shop-header-height)] absolute top-0 left-0 right-0 border-b border-gray-200 bg-background',
          )}
        >
          <div className="container flex flex-col justify-center h-full">
            <div className="grid grid-cols-2 lg:grid-cols-3 items-center justify-center">
              <div className="col-span-1 flex items-center justify-start">
                <Link href="/" className="relative">
                  <Logo />
                </Link>
              </div>
              <div className="col-span-1 items-center justify-center h-full hidden lg:flex">
                <DesktopNav header={header} />
              </div>
              <div className="col-span-1 flex items-center justify-end h-full">
                <MobileNav header={header} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
