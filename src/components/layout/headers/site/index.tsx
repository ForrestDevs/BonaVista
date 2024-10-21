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
    <header className="fixed w-full z-50 bg-white py-2">
      <div className="container flex justify-between items-center">
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>
        <MobileNav header={header} />
        <DesktopNav header={header} />
      </div>
    </header>
  )
}
