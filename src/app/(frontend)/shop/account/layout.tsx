import React from 'react'

import { getCurrentUser } from '@lib/data/auth'
import { Separator } from '@components/ui/separator'
import InteractiveLink from '@components/ui/interactive-link'
import AccountNav from '@components/shop/account/layout/account-nav'

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <div data-testid="account-page" className="bg-background min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-48 shrink-0">{user && <AccountNav />}</aside>
          <main className="flex-grow">{user ? dashboard : login}</main>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-semibold mb-2">Got questions?</h3>
            <p className="text-muted-foreground">
              You can find frequently asked questions and answers on our customer service page.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <InteractiveLink href="/customer-service">Customer Service</InteractiveLink>
          </div>
        </div>
      </div>
    </div>
  )
}
