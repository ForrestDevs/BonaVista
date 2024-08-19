import MarketingHeader from '@/components/marketing/layout/nav'
import React from 'react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <MarketingHeader /> */}
      {children}
    </div>
  )
}
