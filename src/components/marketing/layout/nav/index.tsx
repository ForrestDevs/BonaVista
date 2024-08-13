import React from 'react'

import DesktopNav from './desktop-nav'
import MobileNav from './mobile-nav'

export default function MarketingHeader() {
  return (
    <header className="w-full border-b bg-header-gradient">
      <div className="flex h-14 items-center px-4">
        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  )
}
