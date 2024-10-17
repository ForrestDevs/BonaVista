import React from 'react'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import MobileNav from './mobile-nav'
import DesktopNav from './desktop-nav'

export default async function MarketingHeader() {
  const header = await getCachedGlobal<'header'>('header')

  if (!header) return null

  return (
    <header className="fixed w-full z-50 bg-white text-charcoal shadow-md">
      <div className="container">
        <DesktopNav header={header} />
        <MobileNav header={header} />
      </div>
    </header>
  )
}
