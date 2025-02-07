import React from 'react'
import AccountNav from '@/components/shop/account/account-nav'
import { getCustomerDTO } from '@/lib/data/customer'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AccountPageLayout({ children }: { children: React.ReactNode }) {
  const customer = await getCustomerDTO()

  if (!customer) {
    redirect('/shop/auth/login')
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-48 shrink-0">{customer && <AccountNav />}</aside>
          <main className="flex-grow">{children}</main>
        </div>
      </div>
    </div>
  )
}
