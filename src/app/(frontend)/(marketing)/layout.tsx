import MarketingHeader from '@/components/layout/headers/site'
import React from 'react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MarketingHeader />
      {children}
    </div>
  )
}
