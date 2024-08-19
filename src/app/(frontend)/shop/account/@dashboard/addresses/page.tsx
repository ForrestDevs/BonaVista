import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import getPayload from '@/lib/utils/getPayload'

export const metadata: Metadata = {
  title: 'Addresses',
  description: 'View your addresses',
}

export default async function Addresses() {
  const nextHeaders = headers()
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: nextHeaders })

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
