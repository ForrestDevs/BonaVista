import React from 'react'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import MobileNav from './mobile-nav'
import DesktopNav from './desktop-nav'
import { Logo } from '@/components/payload/Logo'
import Link from 'next/link'

export default async function MarketingHeader() {
  const header = await getCachedGlobal<'header'>('header')

  if (!header) return null

  return (
    <header className="block z-50 w-full min-h-[83.5px] bg-white">
      <div className='fixed bg-white w-full border-b border-gray-200'>
      <div className="container flex justify-between items-center py-2">
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>
        <MobileNav header={header} />
        <DesktopNav header={header} />
      </div>
      </div>
    </header>
  )
}
