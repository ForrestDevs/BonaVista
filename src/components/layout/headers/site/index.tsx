import React from 'react'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import Link from 'next/link'
import MobileNav from './mobile-nav'
import { DesktopNav } from './desktop-nav'
import { Logo } from '@/components/payload/Logo'

export default async function MarketingHeader() {
  const header = await getCachedGlobal<'header'>('header')

  if (!header) return null

  return (
    <header className="block z-50 w-full min-h-[84.5px] bg-white">
      <div className="fixed bg-white w-full border-b min-h-[84.5px] border-gray-200 flex items-center">
        <div className="container grid grid-cols-2 lg:grid-cols-3 items-center justify-center">
          <div className="col-span-1 flex items-center justify-start">
            <Link href="/" className="relative">
              <Logo />
            </Link>
          </div>
          <div className="col-span-1 items-center justify-center h-full hidden lg:flex">
            <DesktopNav />
          </div>
          <div className="col-span-1 flex items-center justify-end h-full">
            <MobileNav header={header} />
          </div>
        </div>
      </div>
    </header>
  )
}
