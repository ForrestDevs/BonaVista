import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@lib/data/auth'
// import AddressBook from '@components/shop/account/components/address-book'

export const metadata: Metadata = {
  title: 'Addresses',
  description: 'View your addresses',
}

export default async function Addresses() {
  const user = await getCurrentUser()

  if (!user) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
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
