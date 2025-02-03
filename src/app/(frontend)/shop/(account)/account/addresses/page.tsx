import React from 'react'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@lib/data/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Addresses | BonaVista LeisureScapes',
    description: 'View your addresses',
  }
}

export default async function AddressesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/shop/account')
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl">Shipping Addresses</h1>
        <p>
          View and update your shipping addresses, you can add as many as you like. Saving your
          addresses will make them available during checkout.
        </p>
      </div>
      {/* <AddressBook customer={user} /> */}
    </div>
  )
}
